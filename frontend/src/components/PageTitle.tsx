import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/pricing': 'Pricing',
  '/contact': 'Contact',
  '/support': 'Support',
  '/login': 'Sign In',
  '/signup': 'Sign Up',
  '/dashboard': 'Dashboard',
  '/cases': 'Cases',
  '/documents': 'Documents',
  '/orders': 'Orders',
  '/stores': 'Manage Stores',
  '/users': 'Users',
  '/settings': 'Settings',
  '/privacy-policy': 'Privacy Policy',
  '/security': 'Security',
  '/reimbursement-tool': 'Reimbursement Tool',
  '/verify': 'Verify Email',
  '/fba-fees': 'FBA Fees',
  '/weight-dims-alert': 'Weight & Dimensions Alert',
  '/wd-successful-cases': 'WD Successful Cases',
  '/export-import-dimensions': 'Export/Import Dimensions',
  '/fee-calculator': 'Fee Calculator',
}

const baseTitle = 'AMZDUDES'

export default function PageTitle() {
  const location = useLocation()

  useEffect(() => {
    const title = routeTitles[location.pathname] || 'AMZDUDES'
    document.title = title === baseTitle ? baseTitle : `${title} | ${baseTitle}`
  }, [location.pathname])

  return null
}

