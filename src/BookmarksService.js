const BookmarksService = {
    getBookmarks(knex) {
        return knex.select('*').from('bookmarks');
    },

    getBookmarkById(knex, bookmarkId) {
        return knex.select('*').from('bookmarks').where('id', bookmarkId).first();
    },

    insertBookmark(knex, bookmark) {
        // Implement
    },

    updateBookmark(knex, updateData) {
        // Implement
    },

    deleteBookmark(knex, bookmarkId) {

    },
};

module.exports = BookmarksService;
