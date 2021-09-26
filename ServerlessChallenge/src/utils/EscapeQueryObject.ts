import mysql from 'mysql';

const EscapeQueryObject = (obj: Object):Object => Object.fromEntries(Object.entries(obj).map(e => [e[0], mysql.escape(e[1])]))

export default EscapeQueryObject;