import { getBackendIdentifier } from '../backend_identifier.js';
import { DefaultBackendSecretResolver } from './backend-secret/backend_secret_resolver.js';
import { BackendIdScopedSsmEnvironmentEntriesGenerator } from './backend_id_scoped_ssm_environment_entries_generator.js';
import { BackendIdScopedStableBackendIdentifiers } from '../backend_id_scoped_stable_backend_identifiers.js';
/**
 * Serves as a DI container and shared state store for initializing Amplify constructs
 */
export class SingletonConstructContainer {
    stackResolver;
    // uses the CacheEntryGenerator as the map key. The value is what the generator returned the first time it was seen
    providerCache = new Map();
    providerFactoryTokenMap = {};
    /**
     * Initialize the BackendBuildState with a root stack
     */
    constructor(stackResolver) {
        this.stackResolver = stackResolver;
    }
    /**
     * If generator has been seen before, the cached Construct instance is returned
     * Otherwise, the generator is called and the value is cached and returned
     */
    getOrCompute = (generator) => {
        if (!this.providerCache.has(generator)) {
            const scope = this.stackResolver.getStackFor(generator.resourceGroupName);
            const backendId = getBackendIdentifier(scope);
            const ssmEnvironmentEntriesGenerator = new BackendIdScopedSsmEnvironmentEntriesGenerator(scope, backendId);
            const backendSecretResolver = new DefaultBackendSecretResolver(scope, backendId);
            const stableBackendIdentifiers = new BackendIdScopedStableBackendIdentifiers(backendId);
            this.providerCache.set(generator, generator.generateContainerEntry({
                scope,
                backendSecretResolver,
                ssmEnvironmentEntriesGenerator,
                stableBackendIdentifiers,
            }));
        }
        // safe because we set if it doesn't exist above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.providerCache.get(generator);
    };
    /**
     * Gets a ConstructFactory that has previously been registered to a given token.
     * Returns undefined if no construct factory is found for the specified token.
     *
     * NOTE: The return type of this function cannot be guaranteed at compile time because factories are dynamically registered at runtime
     * The return type of the factory is a contract that must be negotiated by the entity that registers a token and the entity that retrieves a token.
     *
     * By convention, tokens should be the name of type T
     */
    getConstructFactory = (token) => {
        if (token in this.providerFactoryTokenMap) {
            return this.providerFactoryTokenMap[token];
        }
        return;
    };
    /**
     * Register a ConstructFactory to a specified token. This ConstructFactory can be retrieved later using getConstructFactory
     * Throws if the token is already registered to a different factory
     */
    registerConstructFactory = (token, provider) => {
        if (token in this.providerFactoryTokenMap &&
            this.providerFactoryTokenMap[token] !== provider) {
            throw new Error(`Token ${token} is already registered to a ProviderFactory`);
        }
        this.providerFactoryTokenMap[token] = provider;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xldG9uX2NvbnN0cnVjdF9jb250YWluZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5naW5lL3NpbmdsZXRvbl9jb25zdHJ1Y3RfY29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQzNGLE9BQU8sRUFBRSw2Q0FBNkMsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBQ3pILE9BQU8sRUFBRSx1Q0FBdUMsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBRTdHOztHQUVHO0FBQ0gsTUFBTSxPQUFPLDJCQUEyQjtJQWFUO0lBWjdCLG1IQUFtSDtJQUNsRyxhQUFhLEdBRzFCLElBQUksR0FBRyxFQUFFLENBQUM7SUFFRyx1QkFBdUIsR0FDdEMsRUFBRSxDQUFDO0lBRUw7O09BRUc7SUFDSCxZQUE2QixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUFHLENBQUM7SUFFN0Q7OztPQUdHO0lBQ0gsWUFBWSxHQUFHLENBQ2IsU0FBMkMsRUFDekIsRUFBRTtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDdEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDMUUsTUFBTSxTQUFTLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUMsTUFBTSw4QkFBOEIsR0FDbEMsSUFBSSw2Q0FBNkMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDdEUsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLDRCQUE0QixDQUM1RCxLQUFLLEVBQ0wsU0FBUyxDQUNWLENBQUM7WUFDRixNQUFNLHdCQUF3QixHQUM1QixJQUFJLHVDQUF1QyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixTQUFTLEVBQ1QsU0FBUyxDQUFDLHNCQUFzQixDQUFDO2dCQUMvQixLQUFLO2dCQUNMLHFCQUFxQjtnQkFDckIsOEJBQThCO2dCQUM5Qix3QkFBd0I7YUFDekIsQ0FBQyxDQUNILENBQUM7U0FDSDtRQUNELGdEQUFnRDtRQUNoRCxvRUFBb0U7UUFDcEUsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUUsQ0FBQztJQUM1QyxDQUFDLENBQUM7SUFFRjs7Ozs7Ozs7T0FRRztJQUNILG1CQUFtQixHQUFHLENBQ3BCLEtBQWEsRUFDb0IsRUFBRTtRQUNuQyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUU7WUFDekMsT0FBTyxJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUF3QixDQUFDO1NBQ25FO1FBQ0QsT0FBTztJQUNULENBQUMsQ0FBQztJQUVGOzs7T0FHRztJQUNILHdCQUF3QixHQUFHLENBQ3pCLEtBQWEsRUFDYixRQUEwQixFQUNwQixFQUFFO1FBQ1IsSUFDRSxLQUFLLElBQUksSUFBSSxDQUFDLHVCQUF1QjtZQUNyQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUSxFQUNoRDtZQUNBLE1BQU0sSUFBSSxLQUFLLENBQ2IsU0FBUyxLQUFLLDZDQUE2QyxDQUM1RCxDQUFDO1NBQ0g7UUFDRCxJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQ2pELENBQUMsQ0FBQztDQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2tSZXNvbHZlciB9IGZyb20gJy4vbmVzdGVkX3N0YWNrX3Jlc29sdmVyLmpzJztcbmltcG9ydCB7XG4gIENvbnN0cnVjdENvbnRhaW5lcixcbiAgQ29uc3RydWN0Q29udGFpbmVyRW50cnlHZW5lcmF0b3IsXG4gIENvbnN0cnVjdEZhY3RvcnksXG4gIFJlc291cmNlUHJvdmlkZXIsXG59IGZyb20gJ0Bhd3MtYW1wbGlmeS9wbHVnaW4tdHlwZXMnO1xuaW1wb3J0IHsgZ2V0QmFja2VuZElkZW50aWZpZXIgfSBmcm9tICcuLi9iYWNrZW5kX2lkZW50aWZpZXIuanMnO1xuaW1wb3J0IHsgRGVmYXVsdEJhY2tlbmRTZWNyZXRSZXNvbHZlciB9IGZyb20gJy4vYmFja2VuZC1zZWNyZXQvYmFja2VuZF9zZWNyZXRfcmVzb2x2ZXIuanMnO1xuaW1wb3J0IHsgQmFja2VuZElkU2NvcGVkU3NtRW52aXJvbm1lbnRFbnRyaWVzR2VuZXJhdG9yIH0gZnJvbSAnLi9iYWNrZW5kX2lkX3Njb3BlZF9zc21fZW52aXJvbm1lbnRfZW50cmllc19nZW5lcmF0b3IuanMnO1xuaW1wb3J0IHsgQmFja2VuZElkU2NvcGVkU3RhYmxlQmFja2VuZElkZW50aWZpZXJzIH0gZnJvbSAnLi4vYmFja2VuZF9pZF9zY29wZWRfc3RhYmxlX2JhY2tlbmRfaWRlbnRpZmllcnMuanMnO1xuXG4vKipcbiAqIFNlcnZlcyBhcyBhIERJIGNvbnRhaW5lciBhbmQgc2hhcmVkIHN0YXRlIHN0b3JlIGZvciBpbml0aWFsaXppbmcgQW1wbGlmeSBjb25zdHJ1Y3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBTaW5nbGV0b25Db25zdHJ1Y3RDb250YWluZXIgaW1wbGVtZW50cyBDb25zdHJ1Y3RDb250YWluZXIge1xuICAvLyB1c2VzIHRoZSBDYWNoZUVudHJ5R2VuZXJhdG9yIGFzIHRoZSBtYXAga2V5LiBUaGUgdmFsdWUgaXMgd2hhdCB0aGUgZ2VuZXJhdG9yIHJldHVybmVkIHRoZSBmaXJzdCB0aW1lIGl0IHdhcyBzZWVuXG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvdmlkZXJDYWNoZTogTWFwPFxuICAgIENvbnN0cnVjdENvbnRhaW5lckVudHJ5R2VuZXJhdG9yLFxuICAgIFJlc291cmNlUHJvdmlkZXJcbiAgPiA9IG5ldyBNYXAoKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IHByb3ZpZGVyRmFjdG9yeVRva2VuTWFwOiBSZWNvcmQ8c3RyaW5nLCBDb25zdHJ1Y3RGYWN0b3J5PiA9XG4gICAge307XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIEJhY2tlbmRCdWlsZFN0YXRlIHdpdGggYSByb290IHN0YWNrXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHN0YWNrUmVzb2x2ZXI6IFN0YWNrUmVzb2x2ZXIpIHt9XG5cbiAgLyoqXG4gICAqIElmIGdlbmVyYXRvciBoYXMgYmVlbiBzZWVuIGJlZm9yZSwgdGhlIGNhY2hlZCBDb25zdHJ1Y3QgaW5zdGFuY2UgaXMgcmV0dXJuZWRcbiAgICogT3RoZXJ3aXNlLCB0aGUgZ2VuZXJhdG9yIGlzIGNhbGxlZCBhbmQgdGhlIHZhbHVlIGlzIGNhY2hlZCBhbmQgcmV0dXJuZWRcbiAgICovXG4gIGdldE9yQ29tcHV0ZSA9IChcbiAgICBnZW5lcmF0b3I6IENvbnN0cnVjdENvbnRhaW5lckVudHJ5R2VuZXJhdG9yXG4gICk6IFJlc291cmNlUHJvdmlkZXIgPT4ge1xuICAgIGlmICghdGhpcy5wcm92aWRlckNhY2hlLmhhcyhnZW5lcmF0b3IpKSB7XG4gICAgICBjb25zdCBzY29wZSA9IHRoaXMuc3RhY2tSZXNvbHZlci5nZXRTdGFja0ZvcihnZW5lcmF0b3IucmVzb3VyY2VHcm91cE5hbWUpO1xuICAgICAgY29uc3QgYmFja2VuZElkID0gZ2V0QmFja2VuZElkZW50aWZpZXIoc2NvcGUpO1xuICAgICAgY29uc3Qgc3NtRW52aXJvbm1lbnRFbnRyaWVzR2VuZXJhdG9yID1cbiAgICAgICAgbmV3IEJhY2tlbmRJZFNjb3BlZFNzbUVudmlyb25tZW50RW50cmllc0dlbmVyYXRvcihzY29wZSwgYmFja2VuZElkKTtcbiAgICAgIGNvbnN0IGJhY2tlbmRTZWNyZXRSZXNvbHZlciA9IG5ldyBEZWZhdWx0QmFja2VuZFNlY3JldFJlc29sdmVyKFxuICAgICAgICBzY29wZSxcbiAgICAgICAgYmFja2VuZElkXG4gICAgICApO1xuICAgICAgY29uc3Qgc3RhYmxlQmFja2VuZElkZW50aWZpZXJzID1cbiAgICAgICAgbmV3IEJhY2tlbmRJZFNjb3BlZFN0YWJsZUJhY2tlbmRJZGVudGlmaWVycyhiYWNrZW5kSWQpO1xuICAgICAgdGhpcy5wcm92aWRlckNhY2hlLnNldChcbiAgICAgICAgZ2VuZXJhdG9yLFxuICAgICAgICBnZW5lcmF0b3IuZ2VuZXJhdGVDb250YWluZXJFbnRyeSh7XG4gICAgICAgICAgc2NvcGUsXG4gICAgICAgICAgYmFja2VuZFNlY3JldFJlc29sdmVyLFxuICAgICAgICAgIHNzbUVudmlyb25tZW50RW50cmllc0dlbmVyYXRvcixcbiAgICAgICAgICBzdGFibGVCYWNrZW5kSWRlbnRpZmllcnMsXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cbiAgICAvLyBzYWZlIGJlY2F1c2Ugd2Ugc2V0IGlmIGl0IGRvZXNuJ3QgZXhpc3QgYWJvdmVcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyQ2FjaGUuZ2V0KGdlbmVyYXRvcikhO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgQ29uc3RydWN0RmFjdG9yeSB0aGF0IGhhcyBwcmV2aW91c2x5IGJlZW4gcmVnaXN0ZXJlZCB0byBhIGdpdmVuIHRva2VuLlxuICAgKiBSZXR1cm5zIHVuZGVmaW5lZCBpZiBubyBjb25zdHJ1Y3QgZmFjdG9yeSBpcyBmb3VuZCBmb3IgdGhlIHNwZWNpZmllZCB0b2tlbi5cbiAgICpcbiAgICogTk9URTogVGhlIHJldHVybiB0eXBlIG9mIHRoaXMgZnVuY3Rpb24gY2Fubm90IGJlIGd1YXJhbnRlZWQgYXQgY29tcGlsZSB0aW1lIGJlY2F1c2UgZmFjdG9yaWVzIGFyZSBkeW5hbWljYWxseSByZWdpc3RlcmVkIGF0IHJ1bnRpbWVcbiAgICogVGhlIHJldHVybiB0eXBlIG9mIHRoZSBmYWN0b3J5IGlzIGEgY29udHJhY3QgdGhhdCBtdXN0IGJlIG5lZ290aWF0ZWQgYnkgdGhlIGVudGl0eSB0aGF0IHJlZ2lzdGVycyBhIHRva2VuIGFuZCB0aGUgZW50aXR5IHRoYXQgcmV0cmlldmVzIGEgdG9rZW4uXG4gICAqXG4gICAqIEJ5IGNvbnZlbnRpb24sIHRva2VucyBzaG91bGQgYmUgdGhlIG5hbWUgb2YgdHlwZSBUXG4gICAqL1xuICBnZXRDb25zdHJ1Y3RGYWN0b3J5ID0gPFQgZXh0ZW5kcyBSZXNvdXJjZVByb3ZpZGVyPihcbiAgICB0b2tlbjogc3RyaW5nXG4gICk6IENvbnN0cnVjdEZhY3Rvcnk8VD4gfCB1bmRlZmluZWQgPT4ge1xuICAgIGlmICh0b2tlbiBpbiB0aGlzLnByb3ZpZGVyRmFjdG9yeVRva2VuTWFwKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm92aWRlckZhY3RvcnlUb2tlbk1hcFt0b2tlbl0gYXMgQ29uc3RydWN0RmFjdG9yeTxUPjtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIENvbnN0cnVjdEZhY3RvcnkgdG8gYSBzcGVjaWZpZWQgdG9rZW4uIFRoaXMgQ29uc3RydWN0RmFjdG9yeSBjYW4gYmUgcmV0cmlldmVkIGxhdGVyIHVzaW5nIGdldENvbnN0cnVjdEZhY3RvcnlcbiAgICogVGhyb3dzIGlmIHRoZSB0b2tlbiBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQgdG8gYSBkaWZmZXJlbnQgZmFjdG9yeVxuICAgKi9cbiAgcmVnaXN0ZXJDb25zdHJ1Y3RGYWN0b3J5ID0gKFxuICAgIHRva2VuOiBzdHJpbmcsXG4gICAgcHJvdmlkZXI6IENvbnN0cnVjdEZhY3RvcnlcbiAgKTogdm9pZCA9PiB7XG4gICAgaWYgKFxuICAgICAgdG9rZW4gaW4gdGhpcy5wcm92aWRlckZhY3RvcnlUb2tlbk1hcCAmJlxuICAgICAgdGhpcy5wcm92aWRlckZhY3RvcnlUb2tlbk1hcFt0b2tlbl0gIT09IHByb3ZpZGVyXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBUb2tlbiAke3Rva2VufSBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQgdG8gYSBQcm92aWRlckZhY3RvcnlgXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLnByb3ZpZGVyRmFjdG9yeVRva2VuTWFwW3Rva2VuXSA9IHByb3ZpZGVyO1xuICB9O1xufVxuIl19