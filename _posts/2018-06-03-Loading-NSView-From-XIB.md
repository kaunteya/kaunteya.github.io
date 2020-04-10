---
layout: post
title: Creating NSView from XIB file
category: Swift
---

### Usage
- Create a XIB file with a single view
- Subclass NSView and make it conform to NibLoadable.
Conformance makes the default implementation available to you.
- Make sure the XIB file name and your View name are same

{% highlight swift %}

// For views that can be loaded from nib file
protocol NibLoadable {
    // Name of the nib file
    static var nibName: String { get }
    static func createFromNib(in bundle: Bundle) -> Self
}

extension NibLoadable where Self: NSView {

    // Default nib name must be same as class name
    static var nibName: String {
        return String(describing: Self.self)
    }

    static func createFromNib(in bundle: Bundle = Bundle.main) -> Self {
        var topLevelArray: NSArray? = nil
        bundle.loadNibNamed(NSNib.Name(nibName), owner: self, topLevelObjects: &topLevelArray)
        let views = Array<Any>(topLevelArray!).filter { $0 is Self }
        return views.last as! Self
    }
}

{% endhighlight %}


### Benefits
- Custom views can be quickly made in a XIB file.
- Less chances of errors

