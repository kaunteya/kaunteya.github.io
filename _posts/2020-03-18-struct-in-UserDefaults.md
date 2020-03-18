---
layout: post
title: Struct in UserDefaults
category: Swift
---

There is a post by Paul where he explains how structs can be stored in UserDefaults.
He recommends storing such objects by encoding them and converting them to `Data` type.
Once the type is converted to `Data` it can be directly stored in UserDefaults

So to make it mode convenient and swifty I have written a following extension

{% highlight swift %}

extension UserDefaults {
    static let encoder = JSONEncoder()
    static let decoder = JSONDecoder()

    func encodeAndSet<T>(_ value: T, forKey defaultName: String) where T: Encodable {
        if let encoded = try? Self.encoder.encode(value) {
            ud.set(encoded, forKey: defaultName)
        }
    }

    open func decodedObject<T>(forKey defaultName: String) -> T? where T: Decodable {
        guard let savedPerson = data(forKey: defaultName) else {
            return nil
        }
        return try? Self.decoder.decode(T.self, from: savedPerson)
    }
}

{% endhighlight %}

After adding these methods to UserDefaults one can easily store Codable types in UserDefaults

{% highlight swift %}

{% endhighlight %}

struct Person: Codable {
    var name: String
    var age: Int
}

var john = Person(name: "John", age: 41)
UserDefaults.standard.encodeAndSet(john, forKey: "user")

let getJohn: Person? = UserDefaults.standard.decodedObject(forKey: "user")
print(getJohn) // print Optional(FR.Person(name: "John", age: 41))

{% endhighlight %}

