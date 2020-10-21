import DomiServer, { IService } from './DomiServer'

class TestService implements IService {
    Name = 'TestService'

    DomiInit() {
        print('Init from server')
    }

    DomiStart() {
        print('Start from server')
    }
}

DomiServer.RegisterService(TestService)
DomiServer.Start().then(() => {
    print('Finished starting')
})
