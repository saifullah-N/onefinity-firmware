import bbctrl
import os


class Ctrl(object):

    def __init__(self, args, ioloop, id):
        self.args = args
        self.ioloop = bbctrl.IOLoop(ioloop)
        self.id = id
        self.timeout = None  # Used in demo mode

        if id and not os.path.exists(id):
            os.mkdir(id)

        # Start log
        if args.demo:
            log_path = self.get_path(filename='bbctrl.log')
        else:
            log_path = args.log
        self.log = bbctrl.log.Log(args, self.ioloop, log_path)

        self.state = bbctrl.State(self)
        self.config = bbctrl.Config(self)

        self.log.get('Ctrl').info('Starting %s' % self.id)

        try:
            self.avr = bbctrl.AVR(self)

            self.i2c = bbctrl.I2C(args.i2c_port, args.demo)
            self.mach = bbctrl.Mach(self, self.avr)
            self.preplanner = bbctrl.Preplanner(self)
            if not args.demo:
                self.gamepadSupport = bbctrl.GamepadSupport(self)
            self.pwr = bbctrl.Pwr(self)

            self.mach.connect()

            os.environ['GCODE_SCRIPT_PATH'] = self.get_upload()

        except Exception:
            self.log.get('Ctrl').exception(
                'Internal error: Control initialization failed')

    def __del__(self):
        print('Ctrl deleted')

    def clear_timeout(self):
        if self.timeout is not None:
            self.ioloop.remove_timeout(self.timeout)
        self.timeout = None

    def set_timeout(self, cb, *args, **kwargs):
        self.clear_timeout()
        t = self.args.client_timeout
        self.timeout = self.ioloop.call_later(t, cb, *args, **kwargs)

    def get_path(self, dir=None, filename=None):
        path = './' + self.id if self.id else '.'
        path = path if dir is None else (path + '/' + dir)
        return path if filename is None else (path + '/' + filename)

    def get_upload(self, filename=None):
        return self.get_path('upload', filename)

    def get_plan(self, filename=None):
        return self.get_path('plans', filename)

    def configure(self):
        # Indirectly configures state via calls to config() and the AVR
        self.config.reload()
        self.state.init()

    def ready(self):
        # This is used to synchronize the start of the preplanner
        self.preplanner.start()

    def close(self):
        self.log.get('Ctrl').info('Closing %s' % self.id)
        self.ioloop.close()
        self.avr.close()
        self.mach.planner.close()
