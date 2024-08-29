import { Tags } from 'aws-cdk-lib';
import { AmplifyStack } from './engine/amplify_stack.js';
import { BackendIdentifierConversions } from '@aws-amplify/platform-core';
/**
 * Creates stacks that are tied to a given project environment via an SSM parameter
 */
export class ProjectEnvironmentMainStackCreator {
    scope;
    backendId;
    mainStack = undefined;
    /**
     * Initialize with a project environment
     */
    constructor(scope, backendId) {
        this.scope = scope;
        this.backendId = backendId;
    }
    /**
     * Get a stack for this environment in the provided CDK scope
     */
    getOrCreateMainStack = () => {
        if (this.mainStack === undefined) {
            this.mainStack = new AmplifyStack(this.scope, BackendIdentifierConversions.toStackName(this.backendId));
        }
        const deploymentType = this.backendId.type;
        Tags.of(this.mainStack).add('created-by', 'amplify');
        if (deploymentType === 'branch') {
            Tags.of(this.mainStack).add('amplify:app-id', this.backendId.namespace);
            Tags.of(this.mainStack).add('amplify:branch-name', this.backendId.name);
            Tags.of(this.mainStack).add('amplify:deployment-type', 'branch');
        }
        else if (deploymentType === 'sandbox') {
            Tags.of(this.mainStack).add('amplify:deployment-type', 'sandbox');
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.mainStack;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdF9lbnZpcm9ubWVudF9tYWluX3N0YWNrX2NyZWF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcHJvamVjdF9lbnZpcm9ubWVudF9tYWluX3N0YWNrX2NyZWF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFTLElBQUksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMxQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDekQsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFMUU7O0dBRUc7QUFDSCxNQUFNLE9BQU8sa0NBQWtDO0lBTTFCO0lBQ0E7SUFOWCxTQUFTLEdBQXNCLFNBQVMsQ0FBQztJQUNqRDs7T0FFRztJQUNILFlBQ21CLEtBQWdCLEVBQ2hCLFNBQTRCO1FBRDVCLFVBQUssR0FBTCxLQUFLLENBQVc7UUFDaEIsY0FBUyxHQUFULFNBQVMsQ0FBbUI7SUFDNUMsQ0FBQztJQUVKOztPQUVHO0lBQ0gsb0JBQW9CLEdBQUcsR0FBVSxFQUFFO1FBQ2pDLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLFlBQVksQ0FDL0IsSUFBSSxDQUFDLEtBQUssRUFDViw0QkFBNEIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUN6RCxDQUFDO1NBQ0g7UUFFRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUMzQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3JELElBQUksY0FBYyxLQUFLLFFBQVEsRUFBRTtZQUMvQixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN4RSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4RSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDbEU7YUFBTSxJQUFJLGNBQWMsS0FBSyxTQUFTLEVBQUU7WUFDdkMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ25FO1FBQ0Qsb0VBQW9FO1FBQ3BFLE9BQU8sSUFBSSxDQUFDLFNBQVUsQ0FBQztJQUN6QixDQUFDLENBQUM7Q0FDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhY2tlbmRJZGVudGlmaWVyLCBNYWluU3RhY2tDcmVhdG9yIH0gZnJvbSAnQGF3cy1hbXBsaWZ5L3BsdWdpbi10eXBlcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFN0YWNrLCBUYWdzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQW1wbGlmeVN0YWNrIH0gZnJvbSAnLi9lbmdpbmUvYW1wbGlmeV9zdGFjay5qcyc7XG5pbXBvcnQgeyBCYWNrZW5kSWRlbnRpZmllckNvbnZlcnNpb25zIH0gZnJvbSAnQGF3cy1hbXBsaWZ5L3BsYXRmb3JtLWNvcmUnO1xuXG4vKipcbiAqIENyZWF0ZXMgc3RhY2tzIHRoYXQgYXJlIHRpZWQgdG8gYSBnaXZlbiBwcm9qZWN0IGVudmlyb25tZW50IHZpYSBhbiBTU00gcGFyYW1ldGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBQcm9qZWN0RW52aXJvbm1lbnRNYWluU3RhY2tDcmVhdG9yIGltcGxlbWVudHMgTWFpblN0YWNrQ3JlYXRvciB7XG4gIHByaXZhdGUgbWFpblN0YWNrOiBTdGFjayB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgLyoqXG4gICAqIEluaXRpYWxpemUgd2l0aCBhIHByb2plY3QgZW52aXJvbm1lbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2NvcGU6IENvbnN0cnVjdCxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGJhY2tlbmRJZDogQmFja2VuZElkZW50aWZpZXJcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBHZXQgYSBzdGFjayBmb3IgdGhpcyBlbnZpcm9ubWVudCBpbiB0aGUgcHJvdmlkZWQgQ0RLIHNjb3BlXG4gICAqL1xuICBnZXRPckNyZWF0ZU1haW5TdGFjayA9ICgpOiBTdGFjayA9PiB7XG4gICAgaWYgKHRoaXMubWFpblN0YWNrID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMubWFpblN0YWNrID0gbmV3IEFtcGxpZnlTdGFjayhcbiAgICAgICAgdGhpcy5zY29wZSxcbiAgICAgICAgQmFja2VuZElkZW50aWZpZXJDb252ZXJzaW9ucy50b1N0YWNrTmFtZSh0aGlzLmJhY2tlbmRJZClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgZGVwbG95bWVudFR5cGUgPSB0aGlzLmJhY2tlbmRJZC50eXBlO1xuICAgIFRhZ3Mub2YodGhpcy5tYWluU3RhY2spLmFkZCgnY3JlYXRlZC1ieScsICdhbXBsaWZ5Jyk7XG4gICAgaWYgKGRlcGxveW1lbnRUeXBlID09PSAnYnJhbmNoJykge1xuICAgICAgVGFncy5vZih0aGlzLm1haW5TdGFjaykuYWRkKCdhbXBsaWZ5OmFwcC1pZCcsIHRoaXMuYmFja2VuZElkLm5hbWVzcGFjZSk7XG4gICAgICBUYWdzLm9mKHRoaXMubWFpblN0YWNrKS5hZGQoJ2FtcGxpZnk6YnJhbmNoLW5hbWUnLCB0aGlzLmJhY2tlbmRJZC5uYW1lKTtcbiAgICAgIFRhZ3Mub2YodGhpcy5tYWluU3RhY2spLmFkZCgnYW1wbGlmeTpkZXBsb3ltZW50LXR5cGUnLCAnYnJhbmNoJyk7XG4gICAgfSBlbHNlIGlmIChkZXBsb3ltZW50VHlwZSA9PT0gJ3NhbmRib3gnKSB7XG4gICAgICBUYWdzLm9mKHRoaXMubWFpblN0YWNrKS5hZGQoJ2FtcGxpZnk6ZGVwbG95bWVudC10eXBlJywgJ3NhbmRib3gnKTtcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICByZXR1cm4gdGhpcy5tYWluU3RhY2shO1xuICB9O1xufVxuIl19