"""
Fetch Inventory → Shipping Queue data via SP-API Fulfillment Inbound API (list inbound shipments).
Maps to fba_shipments table columns: shipment name, created, last updated, ship to, SKUs, expected units, status.
"""
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional

from .sp_api_client import SPAPIClient

# Fulfillment Inbound: list shipments (path varies by region; NA uses sellingpartnerapi-na)
INBOUND_SHIPMENTS_PATH = "/fba/inbound/v0/shipments"


def _parse_iso(s: Optional[str]) -> Optional[datetime]:
    if not s:
        return None
    try:
        dt = datetime.fromisoformat(s.replace("Z", "+00:00"))
        return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
    except Exception:
        return None


def fetch_shipments(
    client: SPAPIClient,
    store_id: int,
    last_updated_after: Optional[datetime] = None,
    last_updated_before: Optional[datetime] = None,
    status_list: Optional[List[str]] = None,
) -> List[Dict[str, Any]]:
    """
    Call Fulfillment Inbound listInboundShipments (or equivalent), return rows for fba_shipments.
    """
    params: Dict[str, Any] = {}
    if last_updated_after:
        params["LastUpdatedAfter"] = last_updated_after.strftime("%Y-%m-%dT%H:%M:%SZ")
    if last_updated_before:
        params["LastUpdatedBefore"] = last_updated_before.strftime("%Y-%m-%dT%H:%M:%SZ")
    if status_list:
        params["ShipmentStatusList"] = status_list
    all_rows: List[Dict[str, Any]] = []
    next_token: Optional[str] = None
    for _ in range(20):
        if next_token:
            params["NextToken"] = next_token
        try:
            data = client.request("GET", INBOUND_SHIPMENTS_PATH, params=params if params else None)
        except Exception:
            break
        payload = data.get("payload") or data
        shipments = payload.get("ShipmentData") or payload.get("shipmentData") or []
        for s in shipments:
            sid = s.get("ShipmentId") or s.get("shipmentId") or ""
            ref = s.get("ReferenceId") or s.get("referenceId")
            name = s.get("ShipmentName") or s.get("shipmentName") or f"{sid}, {ref or ''}"
            created = _parse_iso(s.get("CreatedDate") or s.get("createdDate"))
            updated = _parse_iso(s.get("LastUpdatedDate") or s.get("lastUpdatedDate"))
            dest = s.get("DestinationFulfillmentCenterId") or s.get("destinationFulfillmentCenterId") or s.get("ShipToFulfillmentCenterId") or s.get("shipToFulfillmentCenterId")
            status = s.get("ShipmentStatus") or s.get("shipmentStatus")
            all_rows.append({
                "store_id": store_id,
                "shipment_id": str(sid)[:128],
                "reference_id": (ref or "")[:128] or None,
                "shipment_name": (name or "")[:255] or None,
                "created_at_utc": created,
                "updated_at_utc": updated,
                "ship_to": (dest or "")[:32] or None,
                "sku_count": s.get("NumberOfItems") or s.get("numberOfItems"),
                "expected_units": s.get("ExpectedQuantity") or s.get("expectedQuantity"),
                "status": (status or "")[:32] or None,
            })
        next_token = payload.get("NextToken") or payload.get("nextToken")
        if not next_token:
            break
    return all_rows
