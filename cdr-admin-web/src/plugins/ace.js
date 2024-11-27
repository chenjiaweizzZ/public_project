import ace from 'ace-builds'

ace.config.setModuleUrl(
  'ace/mode/javascript',
  require('file-loader?esModule=false!ace-builds/src-noconflict/mode-javascript.js')
)
ace.config.setModuleUrl(
  'ace/ext/language_tools',
  require('file-loader?esModule=false!ace-builds/src-noconflict/ext-language_tools.js')
)
ace.config.setModuleUrl(
  'ace/snippets/javascript',
  require('file-loader?esModule=false!ace-builds/src-noconflict/snippets/javascript.js')
)
ace.config.setModuleUrl(
  'ace/theme/chrome',
  require('file-loader?esModule=false!ace-builds/src-noconflict/theme-chrome.js')
)
ace.config.setModuleUrl(
  'ace/mode/javascript_worker',
  require('file-loader?esModule=false!ace-builds/src-noconflict/worker-javascript.js')
)

export default ace
