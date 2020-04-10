---
layout: post
title: Exploring distribution in UIStackView
category: Swift
---

![StackView](https://user-images.githubusercontent.com/2352321/28924052-f76fe29a-787d-11e7-8856-43b86347ef16.gif)


### Fill
This is the default distribution.
Subview that has lowest Content Hugging priority(CHP) will get stretched.
All other arranged subviews maintain same size.
If more than one subview have same lowest CHP then Xcode complains about `Priority Ambiguity`. You can have multiple subviews of same CHP but make sure they are not the ones which have lowest priority.

### Fill Equally
Here every subview `tries` to maintain equal size irrespective of what their intrinsic content size is. CHP comes into scene when StackView wants to compress the arranged subviews and it is not possible to maintain equal size. In this case all the subviews which can be compressed, are compressed one at a time. Here subview with Higher CHP will be compressed first.

### Fill Proportionally
Views are proportionally resized based on their Intrinsic content size

### Equal Spacing
All views are set to their intrinsic content size and the space between the views is dynamic.

### Equal Centering
Center point of all the views are equidistant
