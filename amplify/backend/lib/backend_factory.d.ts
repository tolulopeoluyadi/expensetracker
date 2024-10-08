import { ConstructFactory, DeepPartialAmplifyGeneratedConfigs, ResourceProvider } from '@aws-amplify/plugin-types';
import { Stack } from 'aws-cdk-lib';
import { Backend, DefineBackendProps } from './backend.js';
import { ClientConfig } from '@aws-amplify/client-config';
/**
 * Factory that collects and instantiates all the Amplify backend constructs
 */
export declare class BackendFactory<T extends Record<string, ConstructFactory<ResourceProvider>>> {
    /**
     * These are the resolved CDK constructs that are created by the inputs to the constructor
     * Used for overriding properties of underlying CDK constructs or to reference in custom CDK code
     */
    readonly resources: {
        [K in keyof T]: ReturnType<T[K]['getInstance']>;
    };
    private readonly stackResolver;
    private readonly customOutputsAccumulator;
    /**
     * Initialize an Amplify backend with the given construct factories and in the given CDK App.
     * If no CDK App is specified a new one is created
     */
    constructor(constructFactories: T, stack?: Stack);
    /**
     * Returns a CDK stack within the Amplify project that can be used for creating custom resources.
     * If a stack has already been created with "name" then an error is thrown.
     */
    createStack: (name: string) => Stack;
    addOutput: (clientConfigPart: DeepPartialAmplifyGeneratedConfigs<ClientConfig>) => void;
}
/**
 * Creates a new Amplify backend instance and returns it
 * @param constructFactories - list of backend factories such as those created by `defineAuth` or `defineData`
 */
export declare const defineBackend: <T extends DefineBackendProps>(constructFactories: T) => Backend<T>;
//# sourceMappingURL=backend_factory.d.ts.map