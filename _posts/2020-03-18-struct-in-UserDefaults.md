---
layout: post
title: Storing Struct in UserDefaults
category: Swift
---

There is a [post][1] by Paul Hudson where he explains how structs can be stored in UserDefaults.
He recommends converting the value to `Data` type first and then store it directly in UserDefaults.

Similarly for retreving, get the `Data` and decode it to get the desired type back

So to make it more convenient and [Swifty][2], I have written the following extension

{% highlight swift %}

extension UserDefaults {
    private static let encoder = JSONEncoder()
    private static let decoder = JSONDecoder()

    func encodeAndSet<T>(_ value: T, forKey defaultName: String) where T: Encodable {
        if let encoded = try? Self.encoder.encode(value) {
            set(encoded, forKey: defaultName)
        }
    }

    open func decodedObject<T>(forKey defaultName: String) -> T? where T: Decodable {
        guard let data = data(forKey: defaultName) else {
            return nil
        }
        return try? Self.decoder.decode(T.self, from: data)
    }
}

{% endhighlight %}

After adding above methods to UserDefaults one can easily store Codable types in UserDefaults with just one line of code

{% highlight swift %}

struct Person: Codable {
    var name: String
    var age: Int
}

var john = Person(name: "John", age: 41)
UserDefaults.standard.encodeAndSet(john, forKey: "user")

let getJohn: Person? = UserDefaults.standard.decodedObject(forKey: "user")
print(getJohn) // print Optional(FR.Person(name: "John", age: 41))

{% endhighlight %}

[1]: https://www.hackingwithswift.com/example-code/system/how-to-load-and-save-a-struct-in-userdefaults-using-codable
[2]: https://www.swiftbysundell.com/articles/what-makes-code-swifty/