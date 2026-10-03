# TradeLearn — Mobile Build & CI/CD Guide (Android & iOS)

This project is configured with [Capacitor](https://capacitorjs.com/) to build native **Android** (`.apk` and `.aab`) and **iOS** (`.ipa` and `.xcarchive`) packages directly from your GitHub repository using **GitHub Actions**.

---

## 1. Automated GitHub Actions Workflows

Three production-ready workflows are configured under `.github/workflows/`:

| Workflow File | Description | Target Platforms | Triggers |
| :--- | :--- | :--- | :--- |
| **`build-mobile.yml`** | Unified dual-platform pipeline | Android + iOS | Push to `main`/`master`, PR, or Manual |
| **`build-android.yml`** | Dedicated Android packaging | Android (Debug APK, Release APK, AAB) | Push or Manual |
| **`build-ios.yml`** | Dedicated macOS/Xcode packaging | iOS (Simulator .app, Xcode Archive) | Push or Manual |

---

## 2. How to Run Builds on GitHub

### Option A: Automatic Trigger on Push
Every push to `main` or `master` automatically triggers the GitHub Actions workflow, compiles the Vite React client, syncs the native wrappers, and builds:
- **Android Debug APK** (`app-debug.apk`)
- **iOS Simulator App** (`App.app.zip`)

### Option B: Manual Trigger (`workflow_dispatch`)
1. In your GitHub repository, navigate to the **Actions** tab.
2. Select **Build Mobile (Android & iOS)**, **Android Build & Release**, or **iOS Build & Archive** from the left sidebar.
3. Click the **Run workflow** dropdown button.
4. Choose your options:
   - **Build Type**: `debug` or `release`
   - **Android Target**: `debug-apk`, `release-apk`, `release-bundle-aab`, or `all`
   - **iOS Target**: `simulator` or `archive`
5. Click **Run workflow**.

---

## 3. Downloading Build Artifacts

Once the GitHub Action completes successfully:
1. Open the completed workflow run.
2. Scroll down to the **Artifacts** section at the bottom of the page.
3. Download:
   - `TradeLearn-Android-Debug-APK`: Direct installable `.apk` file for Android phones and emulators.
   - `TradeLearn-Android-Release-AAB`: Production Android App Bundle (`.aab`) ready for upload to the **Google Play Console**.
   - `TradeLearn-iOS-Simulator-App`: Unsigned `.zip` containing `App.app` that drags & drops directly into the macOS iOS Simulator.
   - `TradeLearn-iOS-Xcode-Archive`: `.xcarchive.zip` ready for TestFlight / App Store submission.

---

## 4. Local Development Commands

You can also run or sync mobile builds locally from your terminal:

```bash
# 1. Build web application and sync both platforms
npm run build:mobile

# 2. Build and sync Android only
npm run build:android

# 3. Open native project in Android Studio
npx cap open android

# 4. Build and sync iOS only (macOS required)
npm run build:ios

# 5. Open native project in Xcode (macOS required)
npx cap open ios
```

---

## 5. Production Signing & Secrets (Optional)

### For Google Play Store (Android):
To automatically sign release builds in GitHub Actions, add these repository secrets in **GitHub Repo > Settings > Secrets and variables > Actions**:
- `ANDROID_KEYSTORE_BASE64`: Base64-encoded `.jks` or `.keystore` file (`base64 -w 0 my-release-key.jks`).
- `ANDROID_KEYSTORE_PASSWORD`: Keystore password.
- `ANDROID_KEY_ALIAS`: Key alias name.
- `ANDROID_KEY_PASSWORD`: Key password.

### For Apple App Store / TestFlight (iOS):
For automated App Store export, use Fastlane or configure:
- `APPLE_CERTIFICATE_BASE64`: Distribution certificate (.p12).
- `APPLE_CERTIFICATE_PASSWORD`: Certificate password.
- `APPLE_PROVISIONING_PROFILE_BASE64`: App Store MobileProvision profile.
- `APP_STORE_CONNECT_API_KEY`: App Store Connect API Key for automated TestFlight upload.
