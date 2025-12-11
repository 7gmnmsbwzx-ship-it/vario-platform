# 🌐 DNS Configuration Guide for getearnly.com

## Step-by-Step Instructions

---

## Step 1: Add Custom Domain in Vercel (Do This First!)

Before configuring DNS, you need to add the domain in Vercel:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your project: `vario-platform46`

2. **Navigate to Domains Settings**
   - Click **Settings** tab
   - Click **Domains** in the left sidebar

3. **Add Your Domain**
   - Enter: `getearnly.com`
   - Click **Add**
   - Also add: `www.getearnly.com` (optional but recommended)

4. **Vercel Will Show DNS Instructions**
   - Vercel will display the exact DNS records you need
   - **IMPORTANT**: Copy these values (they might be different from the generic ones below)

---

## Step 2: Find Your Domain Registrar

Your DNS records are managed by your domain registrar (where you bought `getearnly.com`). Common registrars include:

- **Namecheap** → https://www.namecheap.com
- **GoDaddy** → https://www.godaddy.com
- **Google Domains** → https://domains.google.com
- **Cloudflare** → https://dash.cloudflare.com
- **Name.com** → https://www.name.com
- **Hover** → https://www.hover.com
- **Domain.com** → https://www.domain.com
- **Bluehost** → https://www.bluehost.com

**Not sure where you bought it?** Use WHOIS lookup: https://who.is/whois/getearnly.com

---

## Step 3: Access DNS Settings

### For Namecheap:
1. Login to Namecheap
2. Click **Domain List** (left sidebar)
3. Click **Manage** next to `getearnly.com`
4. Click **Advanced DNS** tab

### For GoDaddy:
1. Login to GoDaddy
2. Click **My Products**
3. Click **DNS** next to `getearnly.com`
4. Scroll to **DNS Records**

### For Cloudflare:
1. Login to Cloudflare
2. Select `getearnly.com` domain
3. Click **DNS** tab

### For Google Domains:
1. Login to Google Domains
2. Click on `getearnly.com`
3. Click **DNS** in the left menu
4. Scroll to **Custom resource records**

---

## Step 4: Configure DNS Records

### Option A: Using Vercel's DNS Records (Recommended)

**Use the exact values Vercel shows you in the dashboard!**

Typically, you'll add these records:

#### Record 1: Root Domain (A Record)
```
Type:  A
Name:  @ (or leave blank, or use "getearnly.com")
Value: 76.76.21.21
TTL:   3600 (or "Automatic")
```

#### Record 2: WWW Subdomain (CNAME Record)
```
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
TTL:   3600 (or "Automatic")
```

---

### Option B: Using Vercel's Name Servers (Alternative)

If you want Vercel to manage all DNS:

1. **In Vercel Dashboard**:
   - Go to Domain Settings
   - Choose "Use Vercel Nameservers"

2. **Copy the Nameservers** (example):
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

3. **In Your Registrar**:
   - Find "Nameservers" or "Custom DNS" section
   - Replace existing nameservers with Vercel's nameservers
   - Save changes

**Note**: This option gives Vercel full DNS control.

---

## Step 5: Remove Conflicting Records

**IMPORTANT**: Before adding new records, remove any conflicting ones:

### Records to DELETE (if they exist):

1. **Delete existing A records** for `@` or `getearnly.com`
2. **Delete existing CNAME records** for `@` or root domain
3. **Delete CNAME record** for `www` if it points elsewhere
4. **Delete A records** that point to other IPs

### Records to KEEP (if they exist):

- ✅ MX records (email)
- ✅ TXT records (email verification, SPF, DKIM)
- ✅ Other subdomains you use (e.g., `mail.getearnly.com`)

---

## Step 6: Add the DNS Records

### Detailed Instructions by Registrar

#### **Namecheap**:
1. Click **Add New Record** button
2. For A record:
   - Type: **A Record**
   - Host: **@**
   - Value: **76.76.21.21**
   - TTL: **Automatic**
3. For CNAME record:
   - Type: **CNAME Record**
   - Host: **www**
   - Value: **cname.vercel-dns.com**
   - TTL: **Automatic**
4. Click **Save All Changes** (green checkmark)

#### **GoDaddy**:
1. Click **Add** button
2. For A record:
   - Type: **A**
   - Name: **@**
   - Value: **76.76.21.21**
   - TTL: **1 Hour** (or default)
3. For CNAME record:
   - Type: **CNAME**
   - Name: **www**
   - Value: **cname.vercel-dns.com**
   - TTL: **1 Hour**
4. Click **Save**

#### **Cloudflare**:
1. Click **Add record** button
2. For A record:
   - Type: **A**
   - Name: **@**
   - IPv4 address: **76.76.21.21**
   - Proxy status: **DNS only** (gray cloud, not orange!)
   - TTL: **Auto**
3. For CNAME record:
   - Type: **CNAME**
   - Name: **www**
   - Target: **cname.vercel-dns.com**
   - Proxy status: **DNS only** (gray cloud!)
   - TTL: **Auto**
4. Click **Save**

**⚠️ CLOUDFLARE USERS**: Make sure to click the orange cloud to turn it **gray** (DNS only mode)!

#### **Google Domains**:
1. In Custom resource records section
2. For A record:
   - Name: **@**
   - Type: **A**
   - TTL: **1h**
   - Data: **76.76.21.21**
3. For CNAME record:
   - Name: **www**
   - Type: **CNAME**
   - TTL: **1h**
   - Data: **cname.vercel-dns.com**
4. Click **Add** for each record

---

## Step 7: Wait for DNS Propagation

DNS changes take time to propagate globally:

- **Minimum**: 5-15 minutes
- **Typical**: 30-60 minutes
- **Maximum**: 24-48 hours (rare)

### How to Check Propagation Status

#### Method 1: Use Online Tools
- **DNS Checker**: https://dnschecker.org
  - Enter: `getearnly.com`
  - Check: A record should show `76.76.21.21`
  
- **What's My DNS**: https://www.whatsmydns.net
  - Enter: `getearnly.com`
  - Type: **A**
  - Should show `76.76.21.21` globally

#### Method 2: Use Command Line

**On Mac/Linux**:
```bash
# Check A record
dig getearnly.com A +short
# Should return: 76.76.21.21

# Check CNAME record
dig www.getearnly.com CNAME +short
# Should return: cname.vercel-dns.com
```

**On Windows (PowerShell)**:
```powershell
# Check A record
nslookup getearnly.com
# Should show: 76.76.21.21

# Check CNAME record
nslookup www.getearnly.com
# Should show: cname.vercel-dns.com
```

#### Method 3: Use Browser
- Try visiting: `http://getearnly.com` (not https yet)
- If you see Vercel's page or your site → DNS is working!

---

## Step 8: Verify in Vercel Dashboard

1. **Go back to Vercel Dashboard**
   - Project → Settings → Domains

2. **Check Domain Status**
   - `getearnly.com` should show: ✅ **Valid Configuration**
   - `www.getearnly.com` should show: ✅ **Valid Configuration**

3. **Wait for SSL Certificate**
   - Vercel automatically provisions SSL (HTTPS)
   - This takes 5-10 minutes after DNS propagates
   - Status will change from "Pending" to "Active"

---

## Step 9: Test Your URLs

Once DNS propagates and SSL is active, test these URLs:

```bash
# Test homepage
curl -I https://getearnly.com/
# Should return: HTTP/2 200

# Test Vario landing page
curl -I https://getearnly.com/vario
# Should return: HTTP/2 200

# Test www redirect
curl -I https://www.getearnly.com/
# Should redirect to: https://getearnly.com/
```

**In Browser**:
- Visit: https://getearnly.com → Should show homepage
- Visit: https://getearnly.com/vario → Should show Vario landing page
- Visit: https://www.getearnly.com → Should redirect to https://getearnly.com

---

## Common Issues & Troubleshooting

### Issue 1: "DNS_PROBE_FINISHED_NXDOMAIN"
**Cause**: DNS records not propagated yet  
**Solution**: Wait 30-60 minutes and try again

### Issue 2: "This site can't provide a secure connection"
**Cause**: SSL certificate not issued yet  
**Solution**: Wait 5-10 minutes after DNS propagates

### Issue 3: Shows old website
**Cause**: DNS cache  
**Solution**: 
```bash
# Clear DNS cache
# Mac
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Windows
ipconfig /flushdns

# Linux
sudo systemd-resolve --flush-caches
```

### Issue 4: Cloudflare showing error
**Cause**: Proxy (orange cloud) enabled  
**Solution**: Turn off Cloudflare proxy (click orange cloud to make it gray)

### Issue 5: "Invalid Configuration" in Vercel
**Cause**: Wrong DNS records or not propagated  
**Solution**: 
1. Double-check DNS records in registrar
2. Wait for propagation
3. Use DNS checker tools

### Issue 6: Works without www but not with www
**Cause**: Missing CNAME record for www  
**Solution**: Add CNAME record: `www` → `cname.vercel-dns.com`

---

## Complete DNS Configuration Example

Here's what your DNS records should look like after setup:

```
Type    Name    Value                       TTL      Status
────────────────────────────────────────────────────────────
A       @       76.76.21.21                 3600     ✅ Active
CNAME   www     cname.vercel-dns.com        3600     ✅ Active
MX      @       mail.getearnly.com          3600     ✅ Keep (if exists)
TXT     @       v=spf1 include:...          3600     ✅ Keep (if exists)
```

---

## Visual DNS Setup Flowchart

```
┌─────────────────────────────────────────┐
│  1. Add Domain in Vercel Dashboard      │
│     └── Copy DNS values shown           │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  2. Login to Your Domain Registrar      │
│     └── Find DNS settings               │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  3. Remove Conflicting DNS Records      │
│     └── Delete old A/CNAME records      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  4. Add New DNS Records                 │
│     ├── A: @ → 76.76.21.21             │
│     └── CNAME: www → cname.vercel-dns   │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  5. Wait for DNS Propagation            │
│     └── 15-60 minutes (use dnschecker)  │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  6. Verify in Vercel Dashboard          │
│     └── Should show "Valid Config"      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  7. Wait for SSL Certificate            │
│     └── Auto-issued by Vercel (5-10min) │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  8. Test Your URLs                      │
│     ├── https://getearnly.com/          │
│     ├── https://getearnly.com/vario     │
│     └── https://getearnly.com/username  │
└─────────────────────────────────────────┘
```

---

## Quick Reference Card

Print or save this for quick reference:

```
╔═══════════════════════════════════════════════════════════════╗
║               DNS CONFIGURATION QUICK REFERENCE               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Domain: getearnly.com                                        ║
║                                                               ║
║  Required DNS Records:                                        ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │ Type: A                                                │  ║
║  │ Name: @                                                │  ║
║  │ Value: 76.76.21.21                                     │  ║
║  │ TTL: 3600                                              │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                               ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │ Type: CNAME                                            │  ║
║  │ Name: www                                              │  ║
║  │ Value: cname.vercel-dns.com                            │  ║
║  │ TTL: 3600                                              │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                               ║
║  Verification Tools:                                          ║
║  • DNS Checker: https://dnschecker.org                       ║
║  • Vercel Dashboard: https://vercel.com/dashboard            ║
║                                                               ║
║  Expected Propagation Time: 15-60 minutes                    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## After DNS is Configured

Once your DNS is working:

1. **Test all URLs**:
   - ✅ https://getearnly.com/
   - ✅ https://getearnly.com/vario
   - ✅ https://getearnly.com/username (after user signup)

2. **Create your first test user**:
   - Go to: https://getearnly.com/signup
   - Create account with username: `testuser`
   - Visit: https://getearnly.com/testuser

3. **Share your Vario landing page**:
   - ✅ https://getearnly.com/vario

---

## Need Help?

If you run into issues:

1. **Check Vercel Status Page**: https://www.vercel-status.com
2. **Vercel Documentation**: https://vercel.com/docs/concepts/projects/domains
3. **DNS Propagation Checker**: https://dnschecker.org
4. **Contact your domain registrar support**

---

## Summary Checklist

- [ ] Added `getearnly.com` in Vercel dashboard
- [ ] Logged into domain registrar
- [ ] Removed conflicting DNS records
- [ ] Added A record: `@` → `76.76.21.21`
- [ ] Added CNAME record: `www` → `cname.vercel-dns.com`
- [ ] Waited for DNS propagation (15-60 min)
- [ ] Verified DNS with dnschecker.org
- [ ] Checked "Valid Configuration" in Vercel
- [ ] Waited for SSL certificate (5-10 min)
- [ ] Tested https://getearnly.com/
- [ ] Tested https://getearnly.com/vario
- [ ] Created test user account
- [ ] Tested https://getearnly.com/testuser

---

**🎉 Once all steps are complete, your Vario platform will be live at getearnly.com!**
