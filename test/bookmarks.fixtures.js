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

module.exports = {
    makeBookmarksArray,
};
