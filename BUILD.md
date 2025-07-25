# Build Instructions

This document explains how to build the Cody No-Login Extension locally and through GitHub Actions.

## Local Build

### Prerequisites

- Node.js 18 or higher
- pnpm package manager
- @vscode/vsce (VS Code Extension Manager)

### Quick Build

Run the build script:

```bash
./build-offline.sh
```

This will:
1. Install dependencies with pnpm
2. Build the shared library
3. Build the VSCode extension
4. Package the extension as `cody-no-login.vsix`

### Manual Build Steps

If you prefer to build manually:

```bash
# Install dependencies
pnpm install

# Build shared library
pnpm build

# Build VSCode extension
cd vscode
pnpm install
pnpm run build

# Package extension
npm install -g @vscode/vsce
vsce package --no-dependencies --out ../cody-no-login.vsix

cd ..
```

## GitHub Actions Build

The repository includes a GitHub Actions workflow for automated multi-platform building.

### Build Workflow (`build-extension.yml`)

**Triggers:**
- Push to any branch
- Manual workflow dispatch

**Platforms Built:**
- Windows x64 (`win32-x64`)
- Windows ARM64 (`win32-arm64`)
- Linux x64 (`linux-x64`)
- Linux ARM64 (`linux-arm64`)
- Linux ARM (`linux-armhf`)
- Alpine x64 (`alpine-x64`)
- Universal (platform-agnostic)

**Outputs:**
- Platform-specific `.vsix` files uploaded as artifacts
- Artifacts stored for 30 days
- No automatic releases (manual release process)

### Running the Build

**From any branch:**
1. Push your changes to any branch
2. GitHub Actions automatically builds for all platforms
3. Download artifacts from the Actions tab

**Manual trigger:**
1. Go to GitHub → Actions → "Build Extension"
2. Click "Run workflow"
3. Select your branch and run
4. Download artifacts when complete

### Platform-Specific Builds

The build matrix creates optimized extensions for different platforms:

```yaml
matrix:
  include:
    - os: windows-latest
      platform: win32
      arch: x64
    - os: windows-latest
      platform: win32
      arch: arm64
    - os: ubuntu-latest
      platform: linux
      arch: x64
    - os: ubuntu-latest
      platform: linux
      arch: arm64
    - os: ubuntu-latest
      platform: linux
      arch: armhf
    - os: ubuntu-latest
      platform: alpine
      arch: x64
```

### Build Artifacts

Each successful build produces:

- **Platform-specific extensions:** `cody-no-login-{platform}-{arch}.vsix`
- **Universal extension:** `cody-no-login-universal.vsix`
- **Build logs and artifacts** (available for 30 days)

### Downloading Artifacts

After a successful build:

1. Go to the GitHub Actions run
2. Scroll down to "Artifacts" section
3. Download the platform-specific `.vsix` files you need
4. Each artifact contains one `.vsix` file for that platform

### Environment Variables

The build process uses these environment variables for cross-compilation:

- `npm_config_target_platform`: Target platform (win32, linux, alpine)
- `npm_config_target_arch`: Target architecture (x64, arm64, arm)

### Caching

The workflow uses caching to speed up builds:

- **pnpm store cache:** Caches downloaded packages
- **Node modules cache:** Caches installed dependencies

### Local Testing

To test the built extension locally:

```bash
# Install the extension
code --install-extension cody-no-login-{platform}-{arch}.vsix

# Or install through VS Code UI:
# 1. Open VS Code
# 2. Go to Extensions (Ctrl+Shift+X)
# 3. Click '...' menu → 'Install from VSIX...'
# 4. Select the appropriate .vsix file for your platform
```

### Development Workflow

1. **Make changes** to the codebase
2. **Test locally** with `./build-offline.sh`
3. **Push to your branch** (triggers multi-platform build)
4. **Download artifacts** from GitHub Actions
5. **Create manual releases** as needed

This provides platform-specific builds for all users without automated release management.
