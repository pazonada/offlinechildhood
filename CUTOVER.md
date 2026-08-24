# Going live on offlinechildhood.com

The domain is registered at **Gandi**, which also runs the mail. Squarespace is
wired in only through DNS, so the switch is a DNS change and nothing else.

## Before you touch anything: the rollback

These are the records as they stood on 2026-08-19, pointing at Squarespace.
Putting them back reverts the site in minutes.

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `198.185.159.144` |
| A | `@` | `198.185.159.145` |
| A | `@` | `198.49.23.144` |
| A | `@` | `198.49.23.145` |
| CNAME | `www` | `ext-cust.squarespace.com.` |

## Do not touch these

Email lives on the same domain. Changing any of these breaks
`hello@offlinechildhood.com`.

| Type | Value |
| --- | --- |
| MX | `10 spool.mail.gandi.net.` |
| MX | `50 fb.mail.gandi.net.` |
| TXT | `v=spf1 include:_mailcust.gandi.net ?all` |

You are only ever changing the four apex `A` records and the `www` `CNAME`.

## Steps

1. **Optional, an hour ahead.** In Gandi, drop the TTL on the apex `A` records and
   the `www` `CNAME` to `300`. This makes the switch, and any rollback, take
   minutes instead of hours.
2. **Vercel** → project → Settings → Domains → add `offlinechildhood.com` and
   `www.offlinechildhood.com`. Vercel shows the records it wants.
3. **Gandi** → Domain → DNS records. Delete the four Squarespace `A` records,
   add the `A` record Vercel gave you, and repoint the `www` `CNAME` at the value
   Vercel gave you. Use Vercel's values rather than any written here, since they
   vary by account.
4. Wait. With a lowered TTL, minutes. Otherwise up to a few hours.
5. **Verify** with the commands below.
6. **Only once it is verified**, cancel Squarespace.

## Verifying

```bash
dig +short offlinechildhood.com A
dig +short www.offlinechildhood.com
curl -sI https://offlinechildhood.com | head -1
dig +short offlinechildhood.com MX
```

The first two should show Vercel's values, the third `HTTP/2 200`, and the
fourth must still show both `gandi.net` mail servers.

Certificates are issued by Vercel automatically once DNS resolves. If HTTPS
warns for the first few minutes, that is the certificate being issued. It should
clear on its own; if it has not after an hour, check the domain shows as valid
in Vercel's dashboard.
