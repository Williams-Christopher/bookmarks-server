const BookmarksService = {
    getBookmarks(knex) {
        return knex.select('*').from('bookmarks');
    },

    getBookmarkById(knex, bookmarkId) {
        return knex.select('*').from('bookmarks').where('id', bookmarkId).first();
    },

    insertBookmark(knex, bookmark) {
        return knex
            .insert(bookmark)
            .into('bookmarks')
            .returning('*')
            .then( rows => {
                return rows[0]
            });
    },

    updateBookmark(knex, bookmarkId, updateData) {
        return knex
            .where({ id: bookmarkId })
            .update(updateData);
    },

    deleteBookmark(knex, bookmarkId) {
        return knex('bookmarks')
            .where({ id: bookmarkId })
            .delete();
    },
};

module.exports = BookmarksService;
