'use strict';

module.exports = 'select'
 + ' categories.name as name_cat,'
 + ' categories.id as id_cat,'
 + ' tags.name as name_tag,'
 + ' tags.id as id_tag'
 + ' from categories'
 + ' join tags_categories on categories.id = tags_categories.id_category'
 + ' join tags on tags_categories.id_tag = tags.id'
 + ' where categories.active = true AND tags.active = true'
 + ' order by categories.name, tags.name;';