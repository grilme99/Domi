import { IResource } from 'Shared/Domi'

class TestController implements IResource {
    Name = 'TestService'

    async DomiInit() {
        print('Starting init from client')
        wait(5)
        print('Init from client')
    }

    DomiStart() {
        print('Start from client')
    }
}

export = TestController
