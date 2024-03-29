export HOME=$(mktemp -d)

export MAKEFLAGS=-j$(nproc)

export BUNDLE_USER_CACHE=$BUNDLING_CACHE_DIR/bundler
export BUNDLE_CLEAN=true
export BUNDLE_DEPLOYMENT=true
export BUNDLE_GLOBAL_GEM_CACHE=true
export BUNDLE_PATH=vendor/bundle
export BUNDLE_RETRY=3

if test -f Gemfile; then
  bundle config set --local deployment "$BUNDLE_DEPLOYMENT"
  bundle config set --local path "$BUNDLE_PATH"
  bundle config set --local without "$BUNDLE_WITHOUT"
  exec bundle install
else
  exec rm -rf vendor/bundle
fi
