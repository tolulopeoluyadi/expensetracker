import { SecretValue } from 'aws-cdk-lib';
import { ParameterPathConversions } from '@aws-amplify/platform-core';
/**
 * Resolves a backend secret to a CFN token via a lambda-backed CFN custom resource.
 */
export class CfnTokenBackendSecret {
    name;
    secretResourceFactory;
    /**
     * The name of the secret to fetch.
     */
    constructor(name, secretResourceFactory) {
        this.name = name;
        this.secretResourceFactory = secretResourceFactory;
    }
    /**
     * Get a reference to the value within a CDK scope.
     */
    resolve = (scope, backendIdentifier) => {
        const secretResource = this.secretResourceFactory.getOrCreate(scope, this.name, backendIdentifier);
        const val = secretResource.getAttString('secretValue');
        return SecretValue.unsafePlainText(val); // safe since 'val' is a cdk token.
    };
    /**
     * Resolve to the secret path
     */
    resolvePath = (backendIdentifier) => {
        return {
            branchSecretPath: ParameterPathConversions.toParameterFullPath(backendIdentifier, this.name),
            sharedSecretPath: ParameterPathConversions.toParameterFullPath(backendIdentifier.namespace, this.name),
        };
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZF9zZWNyZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZW5naW5lL2JhY2tlbmQtc2VjcmV0L2JhY2tlbmRfc2VjcmV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFdEU7O0dBRUc7QUFDSCxNQUFNLE9BQU8scUJBQXFCO0lBS2I7SUFDQTtJQUxuQjs7T0FFRztJQUNILFlBQ21CLElBQVksRUFDWixxQkFBa0Q7UUFEbEQsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBNkI7SUFDbEUsQ0FBQztJQUNKOztPQUVHO0lBQ0gsT0FBTyxHQUFHLENBQ1IsS0FBZ0IsRUFDaEIsaUJBQW9DLEVBQ3ZCLEVBQUU7UUFDZixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUMzRCxLQUFLLEVBQ0wsSUFBSSxDQUFDLElBQUksRUFDVCxpQkFBaUIsQ0FDbEIsQ0FBQztRQUVGLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkQsT0FBTyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsbUNBQW1DO0lBQzlFLENBQUMsQ0FBQztJQUVGOztPQUVHO0lBQ0gsV0FBVyxHQUFHLENBQUMsaUJBQW9DLEVBQXFCLEVBQUU7UUFDeEUsT0FBTztZQUNMLGdCQUFnQixFQUFFLHdCQUF3QixDQUFDLG1CQUFtQixDQUM1RCxpQkFBaUIsRUFDakIsSUFBSSxDQUFDLElBQUksQ0FDVjtZQUNELGdCQUFnQixFQUFFLHdCQUF3QixDQUFDLG1CQUFtQixDQUM1RCxpQkFBaUIsQ0FBQyxTQUFTLEVBQzNCLElBQUksQ0FBQyxJQUFJLENBQ1Y7U0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDO0NBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBCYWNrZW5kSWRlbnRpZmllcixcbiAgQmFja2VuZFNlY3JldCxcbiAgUmVzb2x2ZVBhdGhSZXN1bHQsXG59IGZyb20gJ0Bhd3MtYW1wbGlmeS9wbHVnaW4tdHlwZXMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBCYWNrZW5kU2VjcmV0RmV0Y2hlckZhY3RvcnkgfSBmcm9tICcuL2JhY2tlbmRfc2VjcmV0X2ZldGNoZXJfZmFjdG9yeS5qcyc7XG5pbXBvcnQgeyBTZWNyZXRWYWx1ZSB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IFBhcmFtZXRlclBhdGhDb252ZXJzaW9ucyB9IGZyb20gJ0Bhd3MtYW1wbGlmeS9wbGF0Zm9ybS1jb3JlJztcblxuLyoqXG4gKiBSZXNvbHZlcyBhIGJhY2tlbmQgc2VjcmV0IHRvIGEgQ0ZOIHRva2VuIHZpYSBhIGxhbWJkYS1iYWNrZWQgQ0ZOIGN1c3RvbSByZXNvdXJjZS5cbiAqL1xuZXhwb3J0IGNsYXNzIENmblRva2VuQmFja2VuZFNlY3JldCBpbXBsZW1lbnRzIEJhY2tlbmRTZWNyZXQge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNlY3JldCB0byBmZXRjaC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbmFtZTogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2VjcmV0UmVzb3VyY2VGYWN0b3J5OiBCYWNrZW5kU2VjcmV0RmV0Y2hlckZhY3RvcnlcbiAgKSB7fVxuICAvKipcbiAgICogR2V0IGEgcmVmZXJlbmNlIHRvIHRoZSB2YWx1ZSB3aXRoaW4gYSBDREsgc2NvcGUuXG4gICAqL1xuICByZXNvbHZlID0gKFxuICAgIHNjb3BlOiBDb25zdHJ1Y3QsXG4gICAgYmFja2VuZElkZW50aWZpZXI6IEJhY2tlbmRJZGVudGlmaWVyXG4gICk6IFNlY3JldFZhbHVlID0+IHtcbiAgICBjb25zdCBzZWNyZXRSZXNvdXJjZSA9IHRoaXMuc2VjcmV0UmVzb3VyY2VGYWN0b3J5LmdldE9yQ3JlYXRlKFxuICAgICAgc2NvcGUsXG4gICAgICB0aGlzLm5hbWUsXG4gICAgICBiYWNrZW5kSWRlbnRpZmllclxuICAgICk7XG5cbiAgICBjb25zdCB2YWwgPSBzZWNyZXRSZXNvdXJjZS5nZXRBdHRTdHJpbmcoJ3NlY3JldFZhbHVlJyk7XG4gICAgcmV0dXJuIFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCh2YWwpOyAvLyBzYWZlIHNpbmNlICd2YWwnIGlzIGEgY2RrIHRva2VuLlxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXNvbHZlIHRvIHRoZSBzZWNyZXQgcGF0aFxuICAgKi9cbiAgcmVzb2x2ZVBhdGggPSAoYmFja2VuZElkZW50aWZpZXI6IEJhY2tlbmRJZGVudGlmaWVyKTogUmVzb2x2ZVBhdGhSZXN1bHQgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBicmFuY2hTZWNyZXRQYXRoOiBQYXJhbWV0ZXJQYXRoQ29udmVyc2lvbnMudG9QYXJhbWV0ZXJGdWxsUGF0aChcbiAgICAgICAgYmFja2VuZElkZW50aWZpZXIsXG4gICAgICAgIHRoaXMubmFtZVxuICAgICAgKSxcbiAgICAgIHNoYXJlZFNlY3JldFBhdGg6IFBhcmFtZXRlclBhdGhDb252ZXJzaW9ucy50b1BhcmFtZXRlckZ1bGxQYXRoKFxuICAgICAgICBiYWNrZW5kSWRlbnRpZmllci5uYW1lc3BhY2UsXG4gICAgICAgIHRoaXMubmFtZVxuICAgICAgKSxcbiAgICB9O1xuICB9O1xufVxuIl19