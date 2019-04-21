const styles = theme => ({
  root: {
    flexGrow: 1
  },
  media: {
    // ⚠️ object-fit is not supported by IE11.
    // objectFit: "cover",
  },
  formControl: {
    margin: theme.spacing.unit
  },
  card: {
    marginLeft: "auto",
    marginRight: "auto"
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
});
export default styles;
