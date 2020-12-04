require 'nokogiri'

def handler(*)
  {
    libxml: Nokogiri::LIBXML_VERSION,
  }
end

def handler2(*)
  "hi!"
end
