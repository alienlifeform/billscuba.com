/* ----- CONSTRUCTORS ----- */

var AdminList = function () {
    console.log('AdminList(): LIST INITIALIZED');
    this.recipientsPerPage = 10;
};

var Pagination = function (totalPages) {

    // properties
    this.btnActiveClass = 'admin_num_btn_active';
    this.navContainer = 'ul.admin_list_bottom_nav';
    this.navContainerIdPrefix = '#list_nav_';
    this.navItemContainer = this.navContainer + ' li';
    this.pagesPerSet = 5;
    this.currentPageNum = 1;
    this.currentPageSetNum = 1;
    this.firstVisibleNum = 1;
    this.lastVisibleNum = this.pagesPerSet;
    this.totalPages = totalPages;
    this.totalPageSets = this.totalPages / this.pagesPerSet;


    console.log('Pagination(' + this.totalPages + '): LIST PAGINATION INITIALIZED FOR ' + this.totalPages + ' TOTAL PAGES');

};

/* ----- end CONSTRUCTORS ----- */



/* ----- PROTOTYPES ----- */

AdminList.prototype = {

    initPagination:function (numSubscribers) {
        var totalPages;
        if (numSubscribers % this.recipientsPerPage == 0 ) { //num_subs is exactly x pages
            totalPages =  ( numSubscribers / this.recipientsPerPage );
        } else {
            totalPages = Math.floor( numSubscribers / this.recipientsPerPage ) + 1;
        }
        this.pagination = new Pagination(totalPages);
    },
/*
    search:function () {
        console.log('adminList.searchList(): SEARCH ALL ENTRIES STORED IN THE DATABASE for ' + cms_controller);

        $.ajax({
            beforeSend:function (xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
            },
            type:'POST',
            url:'/' + cms_controller + '/search.js',
            data:$('#admin_admin_search_form').serialize(),
            error:function (xhr, ajaxOptions, thrownError) {
                console.log('ajax error for search ' + cms_controller);
                console.log('ajax error status: ' + xhr.status);
                console.log('ajax error status: ' + thrownError);
            },
            success:function () {
                console.log('ajax success for search ' + cms_controller)
            },
            complete:function () {
                console.log('ajax complete for search ' + cms_controller)
            }
        });
    },

    sortColumn:function () {
        console.log('adminList.sortColumn(): SORT THIS LIST BY THE VALUE SPECIFIED IN THIS TABLE HEADER');
    },

    addListItem:function () {
        console.log('adminList.addListItem(): ADD THIS LIST ITEM');
    },

    editListItem:function () {
        console.log('adminList.editListItem(): EDIT THIS LIST ITEM');
        // onclick currently calls a dialog instead of this
    },

    removeListItem:function () {
        console.log('adminList.removeListItem(): REMOVE THIS LIST ITEM');
        // onclick currently calls a dialog instead of this
    }
*/
}; // end AdminList prototype 


Pagination.prototype = {

    numClick:function (num) {
        this.showListPage(num);
    },

    prevClick:function () {
        var curPgNum = this.currentPageNum;
        if (curPgNum > 1) {
            this.showListPage(curPgNum - 1);
        }
    },

    nextClick:function () {
        var curPgNum = this.currentPageNum;
        if (curPgNum < this.totalPages) {
            this.showListPage(curPgNum + 1);
        }
    },

    prevSetClick:function () {
        var curSetNum = this.currentPageSetNum;
        if (curSetNum > 1) {
            this.showListPageSet(curSetNum - 1);
        }
    },

    nextSetClick:function () {
        var curSetNum = this.currentPageSetNum;
        var totSets = this.totalPageSets;
        if (curSetNum < totSets) {
            this.showListPageSet(curSetNum + 1);
        }
    },

    showListPage:function (num) {
        console.log('Pagination.showListPage(): DISPLAY ADMIN LIST PAGE #' + num);

        var a = this;
        var pgsPerSet = a.pagesPerSet;
        var newNumIsVisibleInNav = num >= a.firstVisibleNum && num <= a.lastVisibleNum;

        // Set vars for the number button elements
        var $oldNumBtn = $(a.navItemContainer + '#' + a.currentPageNum);
        var $newNumBtn = $(a.navItemContainer + '#' + num);

        // Deactivate/activate the buttons
        $oldNumBtn.removeClass(a.btnActiveClass);
        $newNumBtn.addClass(a.btnActiveClass);

        // Set the new page number
        a.currentPageNum = num;

        // If the new page number is not in view in the pagination, show the right list set
        if (!newNumIsVisibleInNav) {
            var correctSet = Math.ceil(num / pgsPerSet);
            this.showListPageSet(correctSet)
        }
    },

    showListPageSet:function (num) {
        console.log('Pagination.showListPageSet(): DISPLAY LIST PAGE SET #' + num);

        var a = this;
        var idPrefix = a.navContainerIdPrefix;
        var pgsPerSet = a.pagesPerSet;
        var curSetNum = a.currentPageSetNum;
        var multiplier = 1;
        var $oldSet = $(idPrefix + curSetNum);
        var $newSet = $(idPrefix + num);
        if (num < curSetNum) {
            multiplier = -1;
        }

        // Set the new first and last number buttons in the pagination
        a.firstVisibleNum += multiplier * pgsPerSet;
        a.lastVisibleNum += multiplier * pgsPerSet;

        // Hide/show the navs
        $oldSet.css('display', 'none');
        $newSet.css('display', 'block');

        // Set the new page set number
        a.currentPageSetNum = num;
    }

}; // end Pagination prototype 

/* ----- end PROTOTYPES ----- */                  
  
