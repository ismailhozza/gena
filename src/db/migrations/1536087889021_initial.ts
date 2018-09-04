/**
 * Create parent table.
 */
export function up(connection: any) {

    // Create parent table.
    const query = "CREATE TABLE `parent` (\
        `id` INT(11) NOT NULL AUTO_INCREMENT,\
        `name` VARCHAR(150) NOT NULL,\
        `mobileNumber` VARCHAR(100) NULL,\
        PRIMARY KEY (`id`),\
        UNIQUE INDEX `parent_name` (`name`))";

    return connection.query(query);
}

/**
 * Drop parent table.
 */
export function down(connection: any) {
    return connection.query("DROP TABLE `parent`");
}