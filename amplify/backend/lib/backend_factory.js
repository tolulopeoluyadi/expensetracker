import { NestedStackResolver, } from './engine/nested_stack_resolver.js';
import { SingletonConstructContainer } from './engine/singleton_construct_container.js';
import { ToggleableImportPathVerifier } from './engine/validations/toggleable_import_path_verifier.js';
import { AttributionMetadataStorage, StackMetadataBackendOutputStorageStrategy, } from '@aws-amplify/backend-output-storage';
import { createDefaultStack } from './default_stack_factory.js';
import { getBackendIdentifier } from './backend_identifier.js';
import { platformOutputKey } from '@aws-amplify/backend-output-schemas';
import { fileURLToPath } from 'node:url';
import { AmplifyBranchLinkerConstruct } from './engine/branch-linker/branch_linker_construct.js';
import { ClientConfigVersionOption, } from '@aws-amplify/client-config';
import { CustomOutputsAccumulator } from './engine/custom_outputs_accumulator.js';
import { ObjectAccumulator } from '@aws-amplify/platform-core';
import { DefaultResourceNameValidator } from './engine/validations/default_resource_name_validator.js';
// Be very careful editing this value. It is the value used in the BI metrics to attribute stacks as Amplify root stacks
const rootStackTypeIdentifier = 'root';
// Client config version that is used by `backend.addOutput()`
const DEFAULT_CLIENT_CONFIG_VERSION_FOR_BACKEND_ADD_OUTPUT = ClientConfigVersionOption.V1_1;
/**
 * Factory that collects and instantiates all the Amplify backend constructs
 */
export class BackendFactory {
    /**
     * These are the resolved CDK constructs that are created by the inputs to the constructor
     * Used for overriding properties of underlying CDK constructs or to reference in custom CDK code
     */
    resources;
    stackResolver;
    customOutputsAccumulator;
    /**
     * Initialize an Amplify backend with the given construct factories and in the given CDK App.
     * If no CDK App is specified a new one is created
     */
    constructor(constructFactories, stack = createDefaultStack()) {
        new AttributionMetadataStorage().storeAttributionMetadata(stack, rootStackTypeIdentifier, fileURLToPath(new URL('../package.json', import.meta.url)));
        this.stackResolver = new NestedStackResolver(stack, new AttributionMetadataStorage());
        const constructContainer = new SingletonConstructContainer(this.stackResolver);
        const outputStorageStrategy = new StackMetadataBackendOutputStorageStrategy(stack);
        this.customOutputsAccumulator = new CustomOutputsAccumulator(outputStorageStrategy, new ObjectAccumulator({}));
        const backendId = getBackendIdentifier(stack);
        outputStorageStrategy.addBackendOutputEntry(platformOutputKey, {
            version: '1',
            payload: {
                deploymentType: backendId.type,
                region: stack.region,
            },
        });
        const shouldEnableBranchLinker = backendId.type === 'branch';
        if (shouldEnableBranchLinker) {
            new AmplifyBranchLinkerConstruct(stack, backendId);
        }
        const importPathVerifier = new ToggleableImportPathVerifier();
        const resourceNameValidator = new DefaultResourceNameValidator();
        // register providers but don't actually execute anything yet
        Object.values(constructFactories).forEach((factory) => {
            if (typeof factory.provides === 'string') {
                constructContainer.registerConstructFactory(factory.provides, factory);
            }
        });
        // now invoke all the factories and collect the constructs into this.resources
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.resources = {};
        Object.entries(constructFactories).forEach(([resourceName, constructFactory]) => {
            // The type inference on this.resources is not happy about this assignment because it doesn't know the exact type of .getInstance()
            // However, the assignment is okay because we are iterating over the entries of constructFactories and assigning the resource name to the corresponding instance
            this.resources[resourceName] = constructFactory.getInstance({
                constructContainer,
                outputStorageStrategy,
                importPathVerifier,
                resourceNameValidator,
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            );
        });
    }
    /**
     * Returns a CDK stack within the Amplify project that can be used for creating custom resources.
     * If a stack has already been created with "name" then an error is thrown.
     */
    createStack = (name) => {
        return this.stackResolver.createCustomStack(name);
    };
    addOutput = (clientConfigPart) => {
        const { version } = clientConfigPart;
        if (!version) {
            clientConfigPart.version =
                DEFAULT_CLIENT_CONFIG_VERSION_FOR_BACKEND_ADD_OUTPUT;
        }
        this.customOutputsAccumulator.addOutput(clientConfigPart);
    };
}
/**
 * Creates a new Amplify backend instance and returns it
 * @param constructFactories - list of backend factories such as those created by `defineAuth` or `defineData`
 */
export const defineBackend = (constructFactories) => {
    const backend = new BackendFactory(constructFactories);
    return {
        ...backend.resources,
        createStack: backend.createStack,
        addOutput: backend.addOutput,
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZF9mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2JhY2tlbmRfZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNQSxPQUFPLEVBQ0wsbUJBQW1CLEdBRXBCLE1BQU0sbUNBQW1DLENBQUM7QUFDM0MsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDeEYsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0seURBQXlELENBQUM7QUFDdkcsT0FBTyxFQUNMLDBCQUEwQixFQUMxQix5Q0FBeUMsR0FDMUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUM3QyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRXpDLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQ2pHLE9BQU8sRUFFTCx5QkFBeUIsR0FDMUIsTUFBTSw0QkFBNEIsQ0FBQztBQUNwQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUNsRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSx5REFBeUQsQ0FBQztBQUV2Ryx3SEFBd0g7QUFDeEgsTUFBTSx1QkFBdUIsR0FBRyxNQUFNLENBQUM7QUFFdkMsOERBQThEO0FBQzlELE1BQU0sb0RBQW9ELEdBQ3hELHlCQUF5QixDQUFDLElBQUksQ0FBQztBQUVqQzs7R0FFRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBR3pCOzs7T0FHRztJQUNNLFNBQVMsQ0FFaEI7SUFFZSxhQUFhLENBQWdCO0lB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O1FBQ0QsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzVELENBQUMsQ0FBQztDQUNIO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLENBQzNCLGtCQUFxQixFQUNULEVBQUU7SUFDZCxNQUFNLE9BQU8sR0FBRyxJQUFJLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3ZELE9BQU87UUFDTCxHQUFHLE9BQU8sQ0FBQyxTQUFTO1FBQ3BCLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVztRQUNoQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7S0FDN0IsQ0FBQztBQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbnN0cnVjdEZhY3RvcnksXG4gIERlZXBQYXJ0aWFsQW1wbGlmeUdlbmVyYXRlZENvbmZpZ3MsXG4gIFJlc291cmNlUHJvdmlkZXIsXG59IGZyb20gJ0Bhd3MtYW1wbGlmeS9wbHVnaW4tdHlwZXMnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQge1xuICBOZXN0ZWRTdGFja1Jlc29sdmVyLFxuICBTdGFja1Jlc29sdmVyLFxufSBmcm9tICcuL2VuZ2luZS9uZXN0ZWRfc3RhY2tfcmVzb2x2ZXIuanMnO1xuaW1wb3J0IHsgU2luZ2xldG9uQ29uc3RydWN0Q29udGFpbmVyIH0gZnJvbSAnLi9lbmdpbmUvc2luZ2xldG9uX2NvbnN0cnVjdF9jb250YWluZXIuanMnO1xuaW1wb3J0IHsgVG9nZ2xlYWJsZUltcG9ydFBhdGhWZXJpZmllciB9IGZyb20gJy4vZW5naW5lL3ZhbGlkYXRpb25zL3RvZ2dsZWFibGVfaW1wb3J0X3BhdGhfdmVyaWZpZXIuanMnO1xuaW1wb3J0IHtcbiAgQXR0cmlidXRpb25NZXRhZGF0YVN0b3JhZ2UsXG4gIFN0YWNrTWV0YWRhdGFCYWNrZW5kT3V0cHV0U3RvcmFnZVN0cmF0ZWd5LFxufSBmcm9tICdAYXdzLWFtcGxpZnkvYmFja2VuZC1vdXRwdXQtc3RvcmFnZSc7XG5pbXBvcnQgeyBjcmVhdGVEZWZhdWx0U3RhY2sgfSBmcm9tICcuL2RlZmF1bHRfc3RhY2tfZmFjdG9yeS5qcyc7XG5pbXBvcnQgeyBnZXRCYWNrZW5kSWRlbnRpZmllciB9IGZyb20gJy4vYmFja2VuZF9pZGVudGlmaWVyLmpzJztcbmltcG9ydCB7IHBsYXRmb3JtT3V0cHV0S2V5IH0gZnJvbSAnQGF3cy1hbXBsaWZ5L2JhY2tlbmQtb3V0cHV0LXNjaGVtYXMnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJztcbmltcG9ydCB7IEJhY2tlbmQsIERlZmluZUJhY2tlbmRQcm9wcyB9IGZyb20gJy4vYmFja2VuZC5qcyc7XG5pbXBvcnQgeyBBbXBsaWZ5QnJhbmNoTGlua2VyQ29uc3RydWN0IH0gZnJvbSAnLi9lbmdpbmUvYnJhbmNoLWxpbmtlci9icmFuY2hfbGlua2VyX2NvbnN0cnVjdC5qcyc7XG5pbXBvcnQge1xuICBDbGllbnRDb25maWcsXG4gIENsaWVudENvbmZpZ1ZlcnNpb25PcHRpb24sXG59IGZyb20gJ0Bhd3MtYW1wbGlmeS9jbGllbnQtY29uZmlnJztcbmltcG9ydCB7IEN1c3RvbU91dHB1dHNBY2N1bXVsYXRvciB9IGZyb20gJy4vZW5naW5lL2N1c3RvbV9vdXRwdXRzX2FjY3VtdWxhdG9yLmpzJztcbmltcG9ydCB7IE9iamVjdEFjY3VtdWxhdG9yIH0gZnJvbSAnQGF3cy1hbXBsaWZ5L3BsYXRmb3JtLWNvcmUnO1xuaW1wb3J0IHsgRGVmYXVsdFJlc291cmNlTmFtZVZhbGlkYXRvciB9IGZyb20gJy4vZW5naW5lL3ZhbGlkYXRpb25zL2RlZmF1bHRfcmVzb3VyY2VfbmFtZV92YWxpZGF0b3IuanMnO1xuXG4vLyBCZSB2ZXJ5IGNhcmVmdWwgZWRpdGluZyB0aGlzIHZhbHVlLiBJdCBpcyB0aGUgdmFsdWUgdXNlZCBpbiB0aGUgQkkgbWV0cmljcyB0byBhdHRyaWJ1dGUgc3RhY2tzIGFzIEFtcGxpZnkgcm9vdCBzdGFja3NcbmNvbnN0IHJvb3RTdGFja1R5cGVJZGVudGlmaWVyID0gJ3Jvb3QnO1xuXG4vLyBDbGllbnQgY29uZmlnIHZlcnNpb24gdGhhdCBpcyB1c2VkIGJ5IGBiYWNrZW5kLmFkZE91dHB1dCgpYFxuY29uc3QgREVGQVVMVF9DTElFTlRfQ09ORklHX1ZFUlNJT05fRk9SX0JBQ0tFTkRfQUREX09VVFBVVCA9XG4gIENsaWVudENvbmZpZ1ZlcnNpb25PcHRpb24uVjFfMTtcblxuLyoqXG4gKiBGYWN0b3J5IHRoYXQgY29sbGVjdHMgYW5kIGluc3RhbnRpYXRlcyBhbGwgdGhlIEFtcGxpZnkgYmFja2VuZCBjb25zdHJ1Y3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBCYWNrZW5kRmFjdG9yeTxcbiAgVCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIENvbnN0cnVjdEZhY3Rvcnk8UmVzb3VyY2VQcm92aWRlcj4+XG4+IHtcbiAgLyoqXG4gICAqIFRoZXNlIGFyZSB0aGUgcmVzb2x2ZWQgQ0RLIGNvbnN0cnVjdHMgdGhhdCBhcmUgY3JlYXRlZCBieSB0aGUgaW5wdXRzIHRvIHRoZSBjb25zdHJ1Y3RvclxuICAgKiBVc2VkIGZvciBvdmVycmlkaW5nIHByb3BlcnRpZXMgb2YgdW5kZXJseWluZyBDREsgY29uc3RydWN0cyBvciB0byByZWZlcmVuY2UgaW4gY3VzdG9tIENESyBjb2RlXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZXM6IHtcbiAgICBbSyBpbiBrZXlvZiBUXTogUmV0dXJuVHlwZTxUW0tdWydnZXRJbnN0YW5jZSddPjtcbiAgfTtcblxuICBwcml2YXRlIHJlYWRvbmx5IHN0YWNrUmVzb2x2ZXI6IFN0YWNrUmVzb2x2ZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgY3VzdG9tT3V0cHV0c0FjY3VtdWxhdG9yOiBDdXN0b21PdXRwdXRzQWNjdW11bGF0b3I7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGFuIEFtcGxpZnkgYmFja2VuZCB3aXRoIHRoZSBnaXZlbiBjb25zdHJ1Y3QgZmFjdG9yaWVzIGFuZCBpbiB0aGUgZ2l2ZW4gQ0RLIEFwcC5cbiAgICogSWYgbm8gQ0RLIEFwcCBpcyBzcGVjaWZpZWQgYSBuZXcgb25lIGlzIGNyZWF0ZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbnN0cnVjdEZhY3RvcmllczogVCwgc3RhY2s6IFN0YWNrID0gY3JlYXRlRGVmYXVsdFN0YWNrKCkpIHtcbiAgICBuZXcgQXR0cmlidXRpb25NZXRhZGF0YVN0b3JhZ2UoKS5zdG9yZUF0dHJpYnV0aW9uTWV0YWRhdGEoXG4gICAgICBzdGFjayxcbiAgICAgIHJvb3RTdGFja1R5cGVJZGVudGlmaWVyLFxuICAgICAgZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuLi9wYWNrYWdlLmpzb24nLCBpbXBvcnQubWV0YS51cmwpKVxuICAgICk7XG4gICAgdGhpcy5zdGFja1Jlc29sdmVyID0gbmV3IE5lc3RlZFN0YWNrUmVzb2x2ZXIoXG4gICAgICBzdGFjayxcbiAgICAgIG5ldyBBdHRyaWJ1dGlvbk1ldGFkYXRhU3RvcmFnZSgpXG4gICAgKTtcblxuICAgIGNvbnN0IGNvbnN0cnVjdENvbnRhaW5lciA9IG5ldyBTaW5nbGV0b25Db25zdHJ1Y3RDb250YWluZXIoXG4gICAgICB0aGlzLnN0YWNrUmVzb2x2ZXJcbiAgICApO1xuXG4gICAgY29uc3Qgb3V0cHV0U3RvcmFnZVN0cmF0ZWd5ID0gbmV3IFN0YWNrTWV0YWRhdGFCYWNrZW5kT3V0cHV0U3RvcmFnZVN0cmF0ZWd5KFxuICAgICAgc3RhY2tcbiAgICApO1xuXG4gICAgdGhpcy5jdXN0b21PdXRwdXRzQWNjdW11bGF0b3IgPSBuZXcgQ3VzdG9tT3V0cHV0c0FjY3VtdWxhdG9yKFxuICAgICAgb3V0cHV0U3RvcmFnZVN0cmF0ZWd5LFxuICAgICAgbmV3IE9iamVjdEFjY3VtdWxhdG9yPENsaWVudENvbmZpZz4oe30pXG4gICAgKTtcblxuICAgIGNvbnN0IGJhY2tlbmRJZCA9IGdldEJhY2tlbmRJZGVudGlmaWVyKHN0YWNrKTtcbiAgICBvdXRwdXRTdG9yYWdlU3RyYXRlZ3kuYWRkQmFja2VuZE91dHB1dEVudHJ5KHBsYXRmb3JtT3V0cHV0S2V5LCB7XG4gICAgICB2ZXJzaW9uOiAnMScsXG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIGRlcGxveW1lbnRUeXBlOiBiYWNrZW5kSWQudHlwZSxcbiAgICAgICAgcmVnaW9uOiBzdGFjay5yZWdpb24sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2hvdWxkRW5hYmxlQnJhbmNoTGlua2VyID0gYmFja2VuZElkLnR5cGUgPT09ICdicmFuY2gnO1xuXG4gICAgaWYgKHNob3VsZEVuYWJsZUJyYW5jaExpbmtlcikge1xuICAgICAgbmV3IEFtcGxpZnlCcmFuY2hMaW5rZXJDb25zdHJ1Y3Qoc3RhY2ssIGJhY2tlbmRJZCk7XG4gICAgfVxuXG4gICAgY29uc3QgaW1wb3J0UGF0aFZlcmlmaWVyID0gbmV3IFRvZ2dsZWFibGVJbXBvcnRQYXRoVmVyaWZpZXIoKTtcblxuICAgIGNvbnN0IHJlc291cmNlTmFtZVZhbGlkYXRvciA9IG5ldyBEZWZhdWx0UmVzb3VyY2VOYW1lVmFsaWRhdG9yKCk7XG5cbiAgICAvLyByZWdpc3RlciBwcm92aWRlcnMgYnV0IGRvbid0IGFjdHVhbGx5IGV4ZWN1dGUgYW55dGhpbmcgeWV0XG4gICAgT2JqZWN0LnZhbHVlcyhjb25zdHJ1Y3RGYWN0b3JpZXMpLmZvckVhY2goKGZhY3RvcnkpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgZmFjdG9yeS5wcm92aWRlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3RydWN0Q29udGFpbmVyLnJlZ2lzdGVyQ29uc3RydWN0RmFjdG9yeShmYWN0b3J5LnByb3ZpZGVzLCBmYWN0b3J5KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIG5vdyBpbnZva2UgYWxsIHRoZSBmYWN0b3JpZXMgYW5kIGNvbGxlY3QgdGhlIGNvbnN0cnVjdHMgaW50byB0aGlzLnJlc291cmNlc1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgdGhpcy5yZXNvdXJjZXMgPSB7fSBhcyBhbnk7XG4gICAgT2JqZWN0LmVudHJpZXMoY29uc3RydWN0RmFjdG9yaWVzKS5mb3JFYWNoKFxuICAgICAgKFtyZXNvdXJjZU5hbWUsIGNvbnN0cnVjdEZhY3RvcnldKSA9PiB7XG4gICAgICAgIC8vIFRoZSB0eXBlIGluZmVyZW5jZSBvbiB0aGlzLnJlc291cmNlcyBpcyBub3QgaGFwcHkgYWJvdXQgdGhpcyBhc3NpZ25tZW50IGJlY2F1c2UgaXQgZG9lc24ndCBrbm93IHRoZSBleGFjdCB0eXBlIG9mIC5nZXRJbnN0YW5jZSgpXG4gICAgICAgIC8vIEhvd2V2ZXIsIHRoZSBhc3NpZ25tZW50IGlzIG9rYXkgYmVjYXVzZSB3ZSBhcmUgaXRlcmF0aW5nIG92ZXIgdGhlIGVudHJpZXMgb2YgY29uc3RydWN0RmFjdG9yaWVzIGFuZCBhc3NpZ25pbmcgdGhlIHJlc291cmNlIG5hbWUgdG8gdGhlIGNvcnJlc3BvbmRpbmcgaW5zdGFuY2VcbiAgICAgICAgdGhpcy5yZXNvdXJjZXNbcmVzb3VyY2VOYW1lIGFzIGtleW9mIFRdID0gY29uc3RydWN0RmFjdG9yeS5nZXRJbnN0YW5jZShcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RDb250YWluZXIsXG4gICAgICAgICAgICBvdXRwdXRTdG9yYWdlU3RyYXRlZ3ksXG4gICAgICAgICAgICBpbXBvcnRQYXRoVmVyaWZpZXIsXG4gICAgICAgICAgICByZXNvdXJjZU5hbWVWYWxpZGF0b3IsXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgICkgYXMgYW55O1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIENESyBzdGFjayB3aXRoaW4gdGhlIEFtcGxpZnkgcHJvamVjdCB0aGF0IGNhbiBiZSB1c2VkIGZvciBjcmVhdGluZyBjdXN0b20gcmVzb3VyY2VzLlxuICAgKiBJZiBhIHN0YWNrIGhhcyBhbHJlYWR5IGJlZW4gY3JlYXRlZCB3aXRoIFwibmFtZVwiIHRoZW4gYW4gZXJyb3IgaXMgdGhyb3duLlxuICAgKi9cbiAgY3JlYXRlU3RhY2sgPSAobmFtZTogc3RyaW5nKTogU3RhY2sgPT4ge1xuICAgIHJldHVybiB0aGlzLnN0YWNrUmVzb2x2ZXIuY3JlYXRlQ3VzdG9tU3RhY2sobmFtZSk7XG4gIH07XG5cbiAgYWRkT3V0cHV0ID0gKFxuICAgIGNsaWVudENvbmZpZ1BhcnQ6IERlZXBQYXJ0aWFsQW1wbGlmeUdlbmVyYXRlZENvbmZpZ3M8Q2xpZW50Q29uZmlnPlxuICApID0+IHtcbiAgICBjb25zdCB7IHZlcnNpb24gfSA9IGNsaWVudENvbmZpZ1BhcnQ7XG4gICAgaWYgKCF2ZXJzaW9uKSB7XG4gICAgICBjbGllbnRDb25maWdQYXJ0LnZlcnNpb24gPVxuICAgICAgICBERUZBVUxUX0NMSUVOVF9DT05GSUdfVkVSU0lPTl9GT1JfQkFDS0VORF9BRERfT1VUUFVUO1xuICAgIH1cbiAgICB0aGlzLmN1c3RvbU91dHB1dHNBY2N1bXVsYXRvci5hZGRPdXRwdXQoY2xpZW50Q29uZmlnUGFydCk7XG4gIH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBBbXBsaWZ5IGJhY2tlbmQgaW5zdGFuY2UgYW5kIHJldHVybnMgaXRcbiAqIEBwYXJhbSBjb25zdHJ1Y3RGYWN0b3JpZXMgLSBsaXN0IG9mIGJhY2tlbmQgZmFjdG9yaWVzIHN1Y2ggYXMgdGhvc2UgY3JlYXRlZCBieSBgZGVmaW5lQXV0aGAgb3IgYGRlZmluZURhdGFgXG4gKi9cbmV4cG9ydCBjb25zdCBkZWZpbmVCYWNrZW5kID0gPFQgZXh0ZW5kcyBEZWZpbmVCYWNrZW5kUHJvcHM+KFxuICBjb25zdHJ1Y3RGYWN0b3JpZXM6IFRcbik6IEJhY2tlbmQ8VD4gPT4ge1xuICBjb25zdCBiYWNrZW5kID0gbmV3IEJhY2tlbmRGYWN0b3J5KGNvbnN0cnVjdEZhY3Rvcmllcyk7XG4gIHJldHVybiB7XG4gICAgLi4uYmFja2VuZC5yZXNvdXJjZXMsXG4gICAgY3JlYXRlU3RhY2s6IGJhY2tlbmQuY3JlYXRlU3RhY2ssXG4gICAgYWRkT3V0cHV0OiBiYWNrZW5kLmFkZE91dHB1dCxcbiAgfTtcbn07XG4iXX0=