p Dir.pwd

require 'bundler/setup'
require 'oj'

def handler(*)
  # This handler ensures the gem with a native extension is bundled properly
  Oj.dump({greeting: 'hi!'})
end
