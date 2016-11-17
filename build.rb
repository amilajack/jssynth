#!/usr/bin/env ruby

require 'rb-fsevent'

def build
  `uglifyjs src/*.js --compress --mangle --source-map jssynth.js.map > jssynth.js`
end

option = (ARGV[0] || '').downcase

if option == '-w' || option == '--watch'
  fsevent = FSEvent.new

  fsevent.watch 'src' do |directories|
    puts "Detected source file change, rebuilding"
    build
  end

  fsevent.run
else
  build
end
