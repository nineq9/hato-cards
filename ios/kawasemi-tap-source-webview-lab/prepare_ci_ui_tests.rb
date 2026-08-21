#!/usr/bin/env ruby
# frozen_string_literal: true

require 'xcodeproj'

project_path = File.expand_path('KAWASEMISourceLab.xcodeproj', __dir__)
project = Xcodeproj::Project.open(project_path)
app_target = project.targets.find { |target| target.name == 'KAWASEMISourceLab' }
abort('KAWASEMISourceLab app target not found') unless app_target

test_target = project.targets.find { |target| target.name == 'KAWASEMISourceLabUITests' }
unless test_target
  test_target = project.new_target(:ui_test_bundle, 'KAWASEMISourceLabUITests', :ios, '17.0')
  test_target.add_dependency(app_target)
end

test_group = project.main_group.find_subpath('KAWASEMISourceLabUITests', true)
test_group.set_source_tree('<group>')
test_group.set_path('KAWASEMISourceLabUITests')

test_file = test_group.files.find { |file| file.path == 'KAWASEMISourceLabUITests.swift' }
test_file ||= test_group.new_file('KAWASEMISourceLabUITests.swift')

unless test_target.source_build_phase.files_references.include?(test_file)
  test_target.source_build_phase.add_file_reference(test_file, true)
end

test_target.build_configurations.each do |config|
  settings = config.build_settings
  settings['CODE_SIGN_STYLE'] = 'Automatic'
  settings['GENERATE_INFOPLIST_FILE'] = 'YES'
  settings['IPHONEOS_DEPLOYMENT_TARGET'] = '17.0'
  settings['PRODUCT_BUNDLE_IDENTIFIER'] = 'com.nineq9.kawasemi.sourcelab.UITests'
  settings['PRODUCT_NAME'] = '$(TARGET_NAME)'
  settings['SWIFT_VERSION'] = '5.0'
  settings['TARGETED_DEVICE_FAMILY'] = '1'
  settings['TEST_TARGET_NAME'] = 'KAWASEMISourceLab'
end

project.save

scheme = Xcodeproj::XCScheme.new
scheme.add_build_target(app_target)
scheme.add_test_target(test_target)
scheme.save_as(project_path, 'KAWASEMISourceLabCI', true)

puts "Prepared KAWASEMISourceLabCI with #{test_target.name}"
