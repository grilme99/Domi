import Domi from 'Shared/Domi'
import TestController from './Controllers/TestController'

Domi.RegisterResource(TestController)
Domi.Start().then(() => {
    print('Finished starting from client')
})
