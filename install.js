import { Service } from 'node-windows'
import path from 'path'
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    console.log('Service installed')
})

service.on('alreadyinstalled', () => {
    service.uninstall() // if the service is installed, uninstall it
})

service.on('invalidinstallation', () => {
    console.log('Invalid installation')
})

service.on('uninstall', () => {
    console.log('Uninstall complete')
})

// else, install
service.install()