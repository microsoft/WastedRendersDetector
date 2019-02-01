
# [WastedRendersDetector](https://github.com/Microsoft/WastedRendersDetector)

Small tool aiming to ease the debugging of wasted react renders.

Wasted react renders is when a react component updates but this does not result in actual DOM mutations.
This is a common problem when using connect().

This tool should be used in debug builds only.
It helps detecting the two following scenarios:
- a component updates because some props changed but the old props and the new props are deep equal.
- a component updates because some function props mutated, this happens if we create lambdas in render() or mapStateToProps.

# Usage

```ts
import { debugOnlyWastedRenderDetector } from "wastedrendersdetector";
import { connect } from "react-redux";

const MyConnectedComponent = connect(mapStateToProps)(debugOnlyWastedRenderDetector(MyBaseComponent));
```

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
