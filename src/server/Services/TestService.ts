import { IResource } from 'Shared/Domi'

class TestService implements IResource {
    Name = 'TestService'

    async DomiInit() {
        print('Starting init from server')
        wait(5)
        print('Init from server')
    }

    DomiStart() {
        print('Start from server')
    }
}

export = TestService
