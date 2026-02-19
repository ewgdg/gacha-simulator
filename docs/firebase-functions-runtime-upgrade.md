# Firebase Functions Runtime Upgrade (February 19, 2026)

## Why this was needed

- Cloud Functions runtime was pinned to `nodejs12`, which is legacy and risky for future deploys.
- Firebase runtime config migration check for project `gacha-simulator-f6d91` returned empty (`{}`), so no `functions.config()` values remain to migrate.

## Changes made

- `functions/package.json`
  - `engines.node`: `12` -> `22`
  - `firebase-functions`: `^3.11.0` -> `^7.0.5`
  - `firebase-admin`: `^9.2.0` -> `^13.6.1`
  - `firebase-functions-test`: `^0.1.6` -> `^3.4.1`
- `functions/index.js`
  - import changed from `firebase-functions` to `firebase-functions/v1` to keep current v1 API usage explicit and compatible.
- `functions/.eslintrc.json`
  - added `"root": true` so functions linting does not inherit root project ESLint plugins.
- `functions/package-lock.json`
  - regenerated and converted to lockfile v2 for stable `npm ci` in Firebase Cloud Build.
- Root `package.json`
  - replaced `node-sass` with `sass`.
  - upgraded `sass-loader` to `^10.5.2` (Webpack 4 compatible).
  - set `NODE_OPTIONS=--openssl-legacy-provider` in Nuxt scripts to handle Webpack 4 + modern Node OpenSSL behavior.
- Root `package-lock.json`
  - regenerated after Sass toolchain updates.
- `scripts/predeploy_functions.sh`
  - made non-interactive and switched hard deletes to `gio trash`.

## Validation done

- Root `npm install` completed after Sass migration.
- Root `npm run build` completed successfully and generated `.nuxt`.
- `npm ci --ignore-scripts` in `functions/` passed after lockfile v2 regeneration.
- `npm run lint` in `functions/` passed.
- Installed versions verified:
  - `firebase-functions@7.0.5`
  - `firebase-admin@13.6.1`
  - `firebase-functions-test@3.4.1`

## Deploy notes

- Functions deploy executed:
  - `npx -y firebase-tools deploy --only functions --project gacha-simulator-f6d91`
- Deploy result:
  - `app` and `createUser` are both deployed as `nodejs22` in `us-central1`.
- Artifact cleanup policy:
  - configured for `gcf-artifacts` in `us-central1` with `7` day retention via `functions:artifacts:setpolicy`.
- Functions predeploy expects root `.nuxt` to exist (`npm run build` in project root).
- `scripts/predeploy_functions.sh` is non-interactive and uses `gio trash` for soft deletion.
- `scripts/predeploy_hosting.sh` is now non-interactive and uses `gio trash` for soft deletion.
