
importScripts('sw-helpers.js');

async function getFetchResult(record) {
  try {
    response = await record.responseReady;
  } catch (e) {
    return null;
  }

  return {
    url: response.url,
    status: response.status,
    text: await response.text(),
  };
}

function handleBackgroundFetchUpdateEvent(event) {
  event.waitUntil(
    event.registration.matchAll()
      .then(records =>
            Promise.all(records.map(record => getFetchResult(record))))
      .then(results => {
        const registrationCopy = cloneRegistration(event.registration);
        sendMessageToDocument(
          { type: event.type, eventRegistration: registrationCopy, results })
      }));
}

self.addEventListener('backgroundfetchsuccess', handleBackgroundFetchUpdateEvent);
self.addEventListener('backgroundfetchfail', handleBackgroundFetchUpdateEvent);
self.addEventListener('backgroundfetchabort', handleBackgroundFetchUpdateEvent);
