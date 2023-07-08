const Cl = require('../cl');

// Mock stdin and stdout
const mockStdin = {
  setEncoding: jest.fn(),
  on: jest.fn(),
};

const mockProcess = {
  stdin: mockStdin,
};

// Mock inquirer
jest.mock('inquirer', () => ({
  prompt: jest.fn().mockResolvedValue({}),
}));

describe('Cl', () => {
  let originalLog;
  let originalError;

  beforeEach(() => {
    originalLog = console.log;
    originalError = console.error;
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.log = originalLog;
    console.error = originalError;
    jest.clearAllMocks();
  });

  describe('init', () => {
    test('should initialize stdin and call prompt', () => {
      Cl.prompt = jest.fn();
      Cl.init(mockProcess);
      expect(mockStdin.setEncoding).toHaveBeenCalledWith('utf8');
      expect(mockStdin.on).toHaveBeenCalledWith('data', Cl.execute);
      expect(Cl.prompt).toHaveBeenCalled();
    });
  });

  describe('asking', () => {
    // test('should call inquirer confirm and execute function if confirmed', async () => {
    //   const message = 'Test message';
    //   const func = jest.fn();
    //   const inquirerPrompt = require('inquirer').prompt;
    //   inquirerPrompt.mockResolvedValue({ confirmation: true });

    //   Cl.ask(message, func);

    //   expect(inquirerPrompt).toHaveBeenCalled();
    //   expect(func).toHaveBeenCalled();
    // });

    test('should not execute function if not confirmed', async () => {
      const message = 'Test message';
      const func = jest.fn();
      const inquirerPrompt = require('inquirer').prompt;
      inquirerPrompt.mockResolvedValue({ confirmation: false });

      Cl.ask(message, func);

      expect(inquirerPrompt).toHaveBeenCalled();
      expect(func).not.toHaveBeenCalled();
    });

    // test('should handle error if prompt fails', async () => {
    //   console.error = jest.fn();
    //   const message = 'Test message';
    //   const func = jest.fn();
    //   const error = new Error('Prompt error');
    //   const inquirerPrompt = require('inquirer').prompt;
    //   inquirerPrompt.mockRejectedValue(error);

    //   Cl.ask(message, func);

    //   expect(inquirerPrompt).toHaveBeenCalled();
    //   expect(console.error).toHaveBeenCalledWith(error);
    // });
  });

  describe('execute', () => {
    test('should execute command function if found in commands', async () => {
      const command = 'verbose';
      Cl.commands = {
        [command]: {
          f: jest.fn(),
        },
      };

      await Cl.execute(command);

      expect(Cl.commands[command].f).toHaveBeenCalled();
    });

    // test('should execute command function if found in commands with correct config', async () => {
    //   const command = 'verbose';
    //   const config = { test: 'config' };
    //   Cl.commands = {
    //     [command]: jest.fn(),
    //   };

    //   await Cl.execute(command);

    //   expect(Cl.commands[command]).toHaveBeenCalledWith(config);
    // });

    // test('should execute jocker function if command matches', async () => {
    //   const command = 'test?param';
    //   const jockerFn = jest.fn();
    //   Cl.jocker = {
    //     [command]: {
    //       f: jockerFn,
    //     },
    //   };

    //   await Cl.execute(command);

    //   expect(jockerFn).toHaveBeenCalledWith('param');
    // });

    // test('should display error if command not found', async () => {
    //   const command = 'unknown';
    //   const clFilename = 'test.js';
    //   __filename = `/path/to/${clFilename}`;

    //   console.error = jest.fn();

    //   await Cl.execute(command);

    //   expect(console.error).toHaveBeenCalledWith(
    //     `Comando não encontrado, para criar, edite o arquivo ${clFilename}`.red
    //   );
    // });
  });

  describe('addModule', () => {
    test('should add module functions to Cl', () => {
      const moduleName = 'testModule';
      const moduleFunctions = {
        function1: jest.fn(),
        function2: jest.fn(),
      };

      Cl.addModule(moduleName, moduleFunctions);

      expect(Cl.commands[`${moduleName}.function1`]).toBeDefined();
      expect(Cl.commands[`${moduleName}.function2`]).toBeDefined();
    });

    // test('should execute module function when called', () => {
    //   const moduleName = 'testModule';
    //   const moduleFunction = jest.fn();
    //   const functionName = 'function1';
    //   const expectedOutput = 'Module function output';

    //   moduleFunction.mockReturnValue(expectedOutput);

    //   Cl.addModule(moduleName, {
    //     [functionName]: moduleFunction,
    //   });

    //   Cl.commands[`${moduleName}.${functionName}`]();

    //   expect(moduleFunction).toHaveBeenCalled();
    //   expect(console.log).toHaveBeenCalledWith(expectedOutput);
    // });

    // test('should handle module function without return value', () => {
    //   const moduleName = 'testModule';
    //   const moduleFunction = jest.fn();

    //   Cl.addModule(moduleName, {
    //     function1: moduleFunction,
    //   });

    //   Cl.commands[`${moduleName}.function1`]();

    //   expect(moduleFunction).toHaveBeenCalled();
    //   expect(console.log).not.toHaveBeenCalled();
    // });
  });

  describe('add', () => {
    test('should add command function to Cl', () => {
      const command = 'testCommand';
      const commandFunction = jest.fn();
      const description = 'Test command description';

      Cl.add(command, commandFunction, description);

      expect(Cl.commands[command]).toBeDefined();
      expect(Cl.commands[command].f).toBe(commandFunction);
      expect(Cl.commands[command].description).toBe(description);
    });

    test('should add jocker function to Cl', () => {
        const command = 'test?param';
        const jockerFunction = jest.fn();
  
        Cl.add(command, jockerFunction);
  
        expect(Cl.jocker[command]).toBeDefined();
        expect(Cl.jocker[command].f).toBe(jockerFunction);
      });
    });
  
    describe('list', () => {
      test('should list all commands', () => {
        Cl.commands = {
          command1: {
            description: 'Command 1 description',
          },
          command2: {
            description: 'Command 2 description',
          },
        };
  
        Cl.jocker = {
          'test?param': {},
          'test2?param': {},
        };
  
        console.log = jest.fn();
  
        Cl.list();
  
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('command1'));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Command 1 description'));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('command2'));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Command 2 description'));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('test?param'));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('test2?param'));
      });
    });
  });  