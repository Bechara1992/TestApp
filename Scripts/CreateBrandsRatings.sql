USE brands_rating;
CREATE TABLE BrandsRating(
ID INT PRIMARY KEY auto_increment,
BrandID INT NOT NULL,
Country varchar(2),
Rating INT NOT NULL,
FOREIGN KEY (BrandID) REFERENCES brands(ID))  character set utf8;