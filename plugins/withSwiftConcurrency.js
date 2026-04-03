const { withDangerousMod } = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

module.exports = (config) =>
  withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile')
      let podfile = fs.readFileSync(podfilePath, 'utf8')

      const patch = `
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |cfg|
        cfg.build_settings['SWIFT_VERSION'] = '5.0'
        cfg.build_settings['SWIFT_STRICT_CONCURRENCY'] = 'minimal'
        cfg.build_settings['OTHER_SWIFT_FLAGS'] = '$(inherited) -strict-concurrency=minimal'
      end
    end`

      podfile = podfile.replace(
        /post_install do \|installer\|/,
        `post_install do |installer|${patch}`
      )

      fs.writeFileSync(podfilePath, podfile)
      return config
    },
  ])
