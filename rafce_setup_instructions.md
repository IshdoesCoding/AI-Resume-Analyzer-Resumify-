# Setting up the "rafce" Shortcut in WebStorm

The "rafce" shortcut (React Arrow Function Component Export) is a popular snippet from VS Code's ES7+ React/Redux/React-Native snippets extension. Here's how to set it up in WebStorm:

## Instructions

1. Open WebStorm Preferences/Settings:
   - On Mac: `WebStorm` > `Preferences` or press `⌘,`
   - On Windows/Linux: `File` > `Settings` or press `Ctrl+Alt+S`

2. Navigate to `Editor` > `Live Templates`

3. Click the `+` button and select `Template Group` to create a new group (optional)
   - Name it "React" or something similar

4. Select your group and click the `+` button again, then select `Live Template`

5. Configure the template:
   - **Abbreviation**: `rafce` (this is what you'll type to trigger the snippet)
   - **Description**: "React Arrow Function Component Export"
   - **Template text**: Copy and paste the following code:

```
import React from 'react'

const $COMPONENT_NAME$ = () => {
  return (
    <div>$END$</div>
  )
}

export default $COMPONENT_NAME$
```

6. Click the "Define" button at the bottom and select:
   - TypeScript JSX
   - JavaScript React

7. Edit variables:
   - Click "Edit Variables"
   - For the `COMPONENT_NAME` variable, set the Expression to `fileNameWithoutExtension()`
   - This will automatically use the file name as the component name

8. Click "Apply" and "OK" to save your template

## Using the Shortcut

1. Create a new file with a `.tsx` or `.jsx` extension
2. Type `rafce` and press Tab or Enter
3. The template will be inserted with the component name matching your file name
4. The cursor will be positioned where the `$END$` marker is placed

## TypeScript Version

If you prefer a TypeScript-specific version, you can create another template with this code:

```
import React from 'react'

const $COMPONENT_NAME$: React.FC = () => {
  return (
    <div>$END$</div>
  )
}

export default $COMPONENT_NAME$
```

Or for more explicit typing:

```
import React from 'react'

const $COMPONENT_NAME$: () => React.JSX.Element = () => {
  return (
    <div>$END$</div>
  )
}

export default $COMPONENT_NAME$
```

Choose the version that best matches your project's coding style.