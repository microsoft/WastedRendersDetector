import * as React from "react";

class WarningComponent extends React.Component<any> {
    public render(): null {
        return null;
    }

    public componentDidUpdate(prevProps: any): void {
        if (!prevProps || !this.props) {
            return;
        }

        // If some props where added or removed then the update is legit.
        if (propsAddedOrRemoved(prevProps, this.props)) {
            return;
        }

        const differences = deepSubstract(prevProps, this.props);

        if (differences === null) {
            console.warn("🚨 WASTED RENDER 🚨, props changing reference for nothing: ", shallowSubstract(prevProps, this.props));
        } else if (isOnlyFunctions(differences)) {
            console.warn("🚨 WASTED RENDER 🚨, props changed because of function reference(s) changing: ", differences);
        }
    }
}

function propsAddedOrRemoved(props1: any, props2: any): boolean {
    const keysProps1 = Object.keys(props1);
    const keysProps2 = Object.keys(props2);
    return keysProps1.length !== keysProps2.length || keysProps1.some(k => keysProps2.indexOf(k) === -1);
}

/*
 * Takes a difference object and check if it contains data or only functions.
 */
function isOnlyFunctions(a: any): boolean {
    if (typeof a === "function") {
        return true;
    }

    if (typeof a !== "object") {
        return false;
    }

    return Object.keys(a).every(k => isOnlyFunctions(a[k]));
}

/*
 * Returns "shallow" A - B
 * Supported types: object
 */
function shallowSubstract(a: any, b: any): object | null {
    const n: any = {};
    Object.keys(a).forEach(key => {
        if (a[key] !== b[key]) {
            n[key] = a[key];
        }
    });

    if (Object.keys(n).length) {
        return n;
    }

    return null;
}

/*
 * Returns "deep" A - B
 * Supported types: any
 * Not supported: circular references
 */
function deepSubstract(a: any, b: any): object | null {
    if (a === b) {
        return null;
    }

    if (typeof a !== "object" || typeof b !== "object") {
        return a;
    }

    const n: any = {};

    Object.keys(a).forEach(key => {
        if (Object.keys(b).indexOf(key) === -1) {
            n[key] = a[key];
        } else {
            const diff = deepSubstract(a[key], b[key]);
            if (diff !== null) {
                n[key] = diff;
            }
        }
    });

    if (Object.keys(n).length) {
        return n;
    }

    return null;
}

/*
 * HOC that checks that on every update whether the props update actually represents a real update.
 * We do this by checking that props update represent a real update of data.
 * We also check that the update is not solely due to a function changing reference.
 * As a result, errors will be logged in the console in case of wasted renders.
 * This component should only be used locally for troublshooting,
 * no usage of it should be checked-in because using it is expensive.
 */
export function debugOnlyWastedRenderDetector<T>(Component: React.ComponentType<T>): React.ComponentType<T> {
    return (props: T) => (
        <React.Fragment>
            <Component {...props} />
            <WarningComponent {...props} />
        </React.Fragment>
    );
}
