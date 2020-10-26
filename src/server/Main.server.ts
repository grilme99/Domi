import Domi from 'Shared/Domi'
import TestService from './Services/TestService'

Domi.RegisterResource(TestService)
Domi.Start().then(() => {
    print('Finished starting from server')
})
