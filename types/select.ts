export type SelectProps = {
  /** Label is the text displayed on top of the list to direct input. The IconInitial value "?" will be
   * appended automatically to the label so it does not need to be added.
   *
   * The value for Label can be a simple string or a struct that will need to be accessed by dot notation
   * inside the templates. For example, `{{ .Name }}` will display the name property of a struct.
   * */
  Label: string;

  /** Items are the items to display inside the list. It expect a slice of any kind of values, including strings.
   *
   * If using a slice of strings, promptui will use those strings directly into its base templates or the
   * provided templates. If using any other type in the slice, it will attempt to transform it into a string
   * before giving it to its templates. Custom templates will override this behavior if using the dot notation
   * inside the templates.
   *
   * For example, `{{ .Name }}` will display the name property of a struct.
   * */
  Items: string[];

  /** Size is the number of items that should appear on the select before scrolling is necessary. Defaults to 5. */
  Size?: number;

  /** CursorPos is the initial position of the cursor. */
  CursorPos?: number;

  /** IsVimMode sets whether to use vim mode when using readline in the command prompt. Look at
   * https://godoc.org/github.com/chzyer/readline#Config for more information on readline.
   */
  IsVimMode?: boolean;
  /** HideHelp sets whether to hide help information. */
  HideHelp?: boolean;

  /** HideSelected sets whether to hide the text displayed after an item is successfully selected. */
  HideSelected?: boolean;

  /** Templates can be used to customize the select output. If nil is passed, the
   * default templates are used. See the SelectTemplates docs for more info.
   */
  Templates?: SelectTemplates;

  /** Keys is the set of keys used in select mode to control the command line interface. See the SelectKeys docs for
   * more info.
   **/
  Keys?: SelectKeys;
  /**
   * Searcher is a function that can be implemented to refine the base searching algorithm in selects.
   *
   * Search is a function that will receive the searched term and the item's index and should return a boolean
   * for whether or not the terms are alike. It is unimplemented by default and search will not work unless
   * it is implemented.
   */

  Searcher?: undefined;
  /** Not implemented */
  _Searcher?: Searcher;

  /** StartInSearchMode sets whether or not the select mode should start in search mode or selection mode.
   * For search mode to work, the Search property must be implemented.
   */
  StartInSearchMode?: boolean;

  list?: undefined;
  /** Not implemented */
  _list?: List;

  /** A function that determines how to render the cursor */
  Pointer?: undefined;
  /** Not implemented */
  _Pointer?: Pointer;
};
/**
 * SelectTemplates allow a select list to be customized following stdlib
 * text/template syntax. Custom state, colors and background color are available for use inside
 * the templates and are documented inside the Variable section of the docs.
 *
 * Examples
 *
 * text/templates use a special notation to display programmable content. Using the double bracket notation,
 * the value can be printed with specific helper functions. For example
 *
 * This displays the value given to the template as pure, unstylized text. Structs are transformed to string
 * with this notation.
 * 	'{{ . }}'
 *
 * This displays the name property of the value colored in cyan
 * 	'{{ .Name | cyan }}'
 *
 * This displays the label property of value colored in red with a cyan background-color
 * 	'{{ .Label | red | cyan }}'
 *
 * See the doc of text/template for more info: https://golang.org/pkg/text/template/
 *
 * Notes
 *
 * Setting any of these templates will remove the icons from the default templates. They must
 * be added back in each of their specific templates. The styles.go constants contains the default icons.
 */
type SelectTemplates = {
  /** Label is a text/template for the main command line label. Defaults to printing the label as it with
   * the IconInitial.
   */
  Label: string;

  /** Active is a text/template for when an item is currently active within the list. */
  Active: string;

  /** Inactive is a text/template for when an item is not currently active inside the list. This
   * template is used for all items unless they are active or selected.
   */
  Inactive: string;
  /** Selected is a text/template for when an item was successfully selected. */
  Selected: string;
  /**
   * Details is a text/template for when an item current active to show
   * additional information. It can have multiple lines.
   *
   * Detail will always be displayed for the active element and thus can be used to display additional
   * information on the element beyond its label.
   *
   * promptui will not trim spaces and tabs will be displayed if the template is indented.
   * */
  Details: string;
  /**
   * Help is a text/template for displaying instructions at the top. By default
   * it shows keys for movement and search.
   *  */
  Help: string;
  /** FuncMap is a map of helper functions that can be used inside of templates according to the text/template
   * documentation.
   *
   * By default, FuncMap contains the color functions used to color the text in templates. If FuncMap
   * is overridden, the colors functions must be added in the override from promptui.FuncMap to work.
   **/
  FuncMap?: undefined;

  /**
   * @todo Implement templating customization
   */
  label?: undefined;
  /**
   * @todo Implement templating customization
   */
  active?: undefined;
  /**
   * @todo Implement templating customization
   */
  inactive?: undefined;
  /**
   * @todo Implement templating customization
   */
  selected?: undefined;
  /**
   * @todo Implement templating customization
   */
  details?: undefined;
  /**
   * @todo Implement templating customization
   */
  help?: undefined;
};

/** SelectKeys defines the available keys used by select mode to enable the user to move around the list
 * and trigger search mode. See the Key struct docs for more information on keys.
 **/
export type SelectKeys = {
  /** Next is the key used to move to the next element inside the list. Defaults to down arrow key. */
  Next: Key;

  /** Prev is the key used to move to the previous element inside the list. Defaults to up arrow key. */
  Prev: Key;

  /** PageUp is the key used to jump back to the first element inside the list. Defaults to left arrow key. */
  PageUp: Key;

  /** PageUp is the key used to jump forward to the last element inside the list. Defaults to right arrow key. */
  PageDown: Key;

  /** Search is the key used to trigger the search mode for the list. Default to the "/" key. */
  Search: Key;
};

/** Key defines a keyboard code and a display representation for the help menu. */
type Key = {
  /** Code is a rune that will be used to compare against typed keys with readline.
   * Check https://github.com/chzyer/readline for a list of codes
   */
  Code: rune;

  /** Display is the string that will be displayed inside the help menu to help inform the user
   * of which key to use on his keyboard for various functions.
   */
  Display: string;
};

/** List holds a collection of items that can be displayed with an N number of
 * visible items. The list can be moved up, down by one item of time or an
 * entire page (ie: visible size). It keeps track of the current selected item.
 */
type List = {
  items: Array<Record<any, any>>; // items holds the list of items to display
  scope: Array<Record<any, any>>; // scope holds the currently visible items
  cursor: number; // cursor holds the index of the current selected item
  size: number; // size is the number of visible options
  start: number;
  Searcher: Searcher;
};

/** Searcher is a base function signature that is used inside select when activating the search mode.
 * If defined, it is called on each items of the select and should return a boolean for whether or not
 * the item fits the searched term.
 */
type Searcher = (input: string, index: number) => boolean;

/** Pointer is A specific type that translates a given set of runes into a given
 * set of runes pointed at by the cursor.
 */
type Pointer = (to: Array<number>) => Array<number>;

type rune = number;
