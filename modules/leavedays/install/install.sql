--
-- Tabelstructuur voor tabel `ld_leave_days`
--

DROP TABLE IF EXISTS `ld_leave_days`;
CREATE TABLE IF NOT EXISTS `ld_leave_days` (
  `id` int(11) AUTO_INCREMENT,
	`user_id` int(11) NOT NULL DEFAULT '0',
	`first_date` int(11) NOT NULL DEFAULT '0',
	`last_date` int(11) NOT NULL DEFAULT '0',
    `from_time` TIME NULL DEFAULT NULL,
	`n_hours` DOUBLE NOT NULL DEFAULT '0',
	`n_nat_holiday_hours` DOUBLE NOT NULL DEFAULT '0',
	`description` varchar(50) NOT NULL DEFAULT '',
	`ctime` int(11) NOT NULL DEFAULT '0',
	`mtime` int(11) NOT NULL DEFAULT '0',
	`status` INT(11) NOT NULL DEFAULT  '0',
  PRIMARY KEY (`id`),
	KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tabelstructuur voor tabel `ld_year_credits`
--

DROP TABLE IF EXISTS `ld_year_credits`;
CREATE TABLE IF NOT EXISTS `ld_year_credits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `year` int(4) NOT NULL DEFAULT '0',
  `n_hours` double NOT NULL DEFAULT '0',
  `comments` varchar(50) NOT NULL DEFAULT '0',
  `manager_user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;