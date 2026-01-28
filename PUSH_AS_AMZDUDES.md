# Push this project only as amzdudesai02-rgb

This repo is **amzdudesai02-rgb/reimbursement**. Use the **amzdudesai02-rgb** GitHub account here. Use junaid3321 for other projects.

## One-time setup (run in this project folder)

```powershell
cd "D:\Amazon Reimbursement"

# 1) Force this repo to use amzdudesai02-rgb for origin
git remote set-url origin https://amzdudesai02-rgb@github.com/amzdudesai02-rgb/reimbursement.git

# 2) Optional: store credentials only when pushing from here (so junaid3321 isn’t used)
#    If you still get "denied to junaid3321", clear GitHub from Credential Manager,
#    then run `git push` and log in as amzdudesai02-rgb when prompted.
```

## Push

```powershell
git add -A
git commit -m "Your message"
git push
```

When prompted, sign in as **amzdudesai02-rgb** and use a Personal Access Token (repo scope) as the password.

## If Git still uses junaid3321

1. **Win + R** → `control /name Microsoft.CredentialManager` → **Windows Credentials**
2. Remove any **github.com** / **git:https://github.com** entries.
3. Run `git push` again and sign in as **amzdudesai02-rgb**.
