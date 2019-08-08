function makeBookmarksArray() {
    return [
        {
            id: 1,
            title: 'Bookmark 1',
            url: 'http://example.com',
            description: 'A sample bookmark',
            rating: '1'
        },
        {
            id: 2,
            title: 'Bookmark 2',
            url: 'http://bookmark2.com',
            description: 'Sample bookmark number 2',
            rating: '2'
        },
        {
            id: 3,
            title: 'Bookmark 3',
            url: 'http://example3.com',
            description: '',
            rating: '3'
        },
        {
            id: 4,
            title: 'Bookmark 4',
            url: 'http://example4.com',
            description: 'Sample bookmark number 4',
            rating: '4'
        },
    ];
};

function makeTestUrls() {
    const testUrls = {
        testUrl: 'http://www.example.com',
        testUrlWithSpace: 'http://www.exam ple.com',
        testUrlWithBadTld: 'http://www.example.invalid',
        testUrlWithIp: 'http://192.168.168.2',
        testUrlWithPort: 'http://www.example.com:1234',
        testUrlSansProtocol: 'www.example.com',
    };

    return testUrls
}

function makeMaliciousBookmark() {
    const maliciousBookmark = {
        id: 911,
        title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        url: 'http://www.example.com',
        description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        rating: 5,
    }
    const sanitizedBookmark = {
        ...maliciousBookmark,
        title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }

    return {
        maliciousBookmark,
        sanitizedBookmark
    }
}

module.exports = {
    makeBookmarksArray,
    makeTestUrls,
    makeMaliciousBookmark,
};
