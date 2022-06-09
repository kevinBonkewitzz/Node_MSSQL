USE [test]
GO
/****** Object:  StoredProcedure [dbo].[ViewTest]    Script Date: 2022/06/09 19:54:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[ViewTest] 
	@testId INT
AS
BEGIN
	SET NOCOUNT ON;
	SELECT * FROM tblTest WHERE Id = @testId
END
