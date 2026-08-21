#!/bin/sh
set -e

REPO="MIt9/post-to-comment"
BIN_NAME="post-to-comment"
ASSET_NAME="post-to-comment-macos"
INSTALL_DIR="${POST_TO_COMMENT_INSTALL_DIR:-$HOME/.local/bin}"

os="$(uname -s)"
if [ "$os" != "Darwin" ]; then
  echo "post-to-comment's install script currently supports macOS (got: $os)." >&2
  exit 1
fi

mkdir -p "$INSTALL_DIR"
tmp_file="$(mktemp)"
url="https://github.com/$REPO/releases/latest/download/$ASSET_NAME"

echo "Downloading $url ..."
curl -fsSL -H "Cache-Control: no-cache" "$url" -o "$tmp_file"

chmod +x "$tmp_file"
xattr -d com.apple.quarantine "$tmp_file" 2>/dev/null || true

dest="$INSTALL_DIR/$BIN_NAME"
mv "$tmp_file" "$dest"

installed_ver="$("$dest" --version 2>/dev/null || echo "")"
if [ -n "$installed_ver" ]; then
  echo "Installed $installed_ver to $dest"
else
  echo "Installed to $dest"
fi

case ":$PATH:" in
  *":$INSTALL_DIR:"*)
    echo "Run: $BIN_NAME --help"
    ;;
  *)
    echo ""
    echo "$INSTALL_DIR is not on your PATH. Add this to ~/.zshrc (or ~/.bash_profile):"
    echo "  export PATH=\"$INSTALL_DIR:\$PATH\""
    ;;
esac
