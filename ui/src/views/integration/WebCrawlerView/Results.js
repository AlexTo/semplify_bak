/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Checkbox,
  InputAdornment,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  makeStyles
} from '@material-ui/core';
import {
  Edit as EditIcon,
  ArrowRight as ArrowRightIcon,
  Search as SearchIcon
} from 'react-feather';
import {useQuery} from "@apollo/react-hooks";
import {webCrawlerQueries} from "../../../graphql/webCrawlerQueries";
import {useSelector} from "react-redux";

const categoryOptions = [
  {
    id: 'all',
    name: 'All'
  },
  {
    id: 'dress',
    name: 'Dress'
  },
  {
    id: 'jewelry',
    name: 'Jewelry'
  },
  {
    id: 'blouse',
    name: 'Blouse'
  },
  {
    id: 'beauty',
    name: 'Beauty'
  }
];

const sortOptions = [
  {
    value: 'updatedAt|desc',
    label: 'Last update (newest first)'
  },
  {
    value: 'updatedAt|asc',
    label: 'Last update (oldest first)'
  },
  {
    value: 'createdAt|desc',
    label: 'Creation date (newest first)'
  },
  {
    value: 'createdAt|asc',
    label: 'Creation date (oldest first)'
  }
];

function applyFilters(webPages, query, filters) {
  return webPages.filter((p) => {
    return true;
  });
}

function applyPagination(webPages, page, limit) {
  return webPages.slice(page * limit, page * limit + limit);
}

const useStyles = makeStyles((theme) => ({
  root: {},
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  queryField: {
    width: 500
  },
  categoryField: {
    flexBasis: 200
  },
  availabilityField: {
    marginLeft: theme.spacing(2),
    flexBasis: 200
  },
  stockField: {
    marginLeft: theme.spacing(2)
  },
  shippableField: {
    marginLeft: theme.spacing(2)
  },
  imageCell: {
    fontSize: 0,
    width: 68,
    flexBasis: 68,
    flexGrow: 0,
    flexShrink: 0
  },
  image: {
    height: 68,
    width: 68
  }
}));

function Results({className, ...rest}) {
  const classes = useStyles();
  const [selectedWebPages, setSelectedWebPages] = useState([]);
  const [page, setPage] = useState(0);
  const [webPages, setWebPages] = useState([]);
  const {projectId} = useSelector(state => state.projectReducer);
  const {data} = useQuery(webCrawlerQueries.crawledPages, {
    variables: {
      projectId
    }
  })
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    domain: null,
  });

  useEffect(() => {
    if (!data) {
      setWebPages([])
      return;
    }
    setWebPages(data.crawledPages);
  }, [data])

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleDomainChange = (event) => {
    event.persist();

    let value = null;

    if (event.target.value !== 'all') {
      value = event.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      domain: value
    }));
  };

  const handleSortChange = (event) => {
    event.persist();
    setSort(event.target.value);
  };

  const handleSelectAll = (event) => {
    setSelectedWebPages(event.target.checked
      ? webPages.map((p) => p.id)
      : []);
  };

  const handleSelectOne = (event, pageId) => {
    if (!selectedWebPages.includes(pageId)) {
      setSelectedWebPages((prevSelected) => [...prevSelected, pageId]);
    } else {
      setSelectedWebPages((prevSelected) => prevSelected.filter((id) => id !== pageId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const filteredList = applyFilters(webPages, query, filters);
  const paginatedList = applyPagination(filteredList, page, limit);
  const enableBulkOperations = selectedWebPages.length > 0;
  const selectedSome = selectedWebPages.length > 0 && selectedWebPages.length < webPages.length;
  const selectedAll = selectedWebPages.length === webPages.length;

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box p={2}>
        <Box
          display="flex"
          alignItems="center"
        >
          <TextField
            className={classes.queryField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon
                    fontSize="small"
                    color="action"
                  >
                    <SearchIcon/>
                  </SvgIcon>
                </InputAdornment>
              )
            }}
            onChange={handleQueryChange}
            placeholder="Search"
            value={query}
            variant="outlined"
          />
          <Box flexGrow={1}/>
          <TextField
            label="Sort By"
            name="sort"
            onChange={handleSortChange}
            select
            SelectProps={{native: true}}
            value={sort}
            variant="outlined"
          >
            {sortOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </TextField>
        </Box>
        <Box
          mt={3}
          display="flex"
          alignItems="center"
        >
          <TextField
            className={classes.categoryField}
            label="Domain"
            name="domain"
            onChange={handleDomainChange}
            select
            SelectProps={{native: true}}
            value={filters.category || 'all'}
            variant="outlined"
          >
            {categoryOptions.map((categoryOption) => (
              <option
                key={categoryOption.id}
                value={categoryOption.id}
              >
                {categoryOption.name}
              </option>
            ))}
          </TextField>
        </Box>
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAll}
              indeterminate={selectedSome}
              onChange={handleSelectAll}
            />
            <Button
              variant="outlined"
              className={classes.bulkAction}>
              Delete
            </Button>
          </div>
        </div>
      )}
      <PerfectScrollbar>
        <Box minWidth={1200}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Title
                </TableCell>
                <TableCell>
                  Url
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedList.map((p) => {
                const isSelected = selectedWebPages.includes(p.id);

                return (
                  <TableRow
                    hover
                    key={p.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => handleSelectOne(event, p.id)}
                        value={isSelected}
                      />
                    </TableCell>
                    <TableCell>
                      {p.title}
                    </TableCell>
                    <TableCell>
                      {p.url}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton>
                        <SvgIcon fontSize="small">
                          <ArrowRightIcon/>
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredList.length}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </PerfectScrollbar>
    </Card>
  );
}

Results.propTypes = {
  className: PropTypes.string,
  products: PropTypes.array
};

Results.defaultProps = {
  products: []
};

export default Results;
