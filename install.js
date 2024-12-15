import { Service } from 'node-windows'
import path from 'path'

// Create a new service object
const service = new Service({
    name: 'Custom Remote Desktop',
    description: 'Custom Remote Desktop Service, used for mouse and keyboard control',
    script: path.join(__dirname, 'index.js')
})

// Listen for the "install" event, which indicates the
// process is available as a service.
service.on('install', () => {
    service.start()
})

service.on('alreadyinstalled', () => {
    console.log('Service already installed')
})

service.on('invalidinstallation', () => {
    console.log('Invalid installation')
})

service.on('uninstall', () => {
    console.log('Uninstall complete')
})

service.install()