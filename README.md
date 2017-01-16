# Arbitrary JSON cache mechanism - how to cache when the browser doesn't want you to
Browsers prohibit you from caching a resource that does not have cache-control headers specified. In other words,
say you have some blob of data your web application needs and for some reason or another, you can't or don't want to proxy through your server. So you have little or no control over the headers appended to the response. What are you to do?

There is no way to specify client side that you want a file to be cached. Why? Not sure. I've heard whispers of security concerns, but I'm not convinced. But anyhow, it is what it is.

One approach is utilizing localStorage as a persistent data store, and for many use cases this is sufficient. (Think of localStorage as a JSON object that will stay in the users browser until they explicitly delete it.) The down side to local storage is it has no means to automatically "release" memory, and it has a 5MB limit per domain. For many applications, that is insufficient.

Say you need many MB files to execute your client side logic. And these files, you lack the control to set a content-control header for (Their from third party sources, or the proxy mechanism you have at your disposal had limited capacity.)

Proposed work-around:

The first time through when the user makes a request for a resource (before we have it cached) we wait till the resource arrives, and then in the background, we will send it to a microservice we have that mirrors payloads.

We send a POST with an arbitrary payload, that we have a unique name for
This payload is saved in a short lived user-specific session variable on our server
We then make a GET request to a URL based on the resource name, and return the payload with a cache-control header.

The next time the user tries to load the page, we attempt to make a request to the same GET url based on the resources name. If the user has it cached, it never hits our servers, and the resource is present instantly. If they don't we reject the request, and the user fetches the data from the source, which we then cache, etc.

