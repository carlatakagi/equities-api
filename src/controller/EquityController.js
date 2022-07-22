import { equitiesData } from '../data/equities.js';

let clientsEquities = [];
let clientsAccounts = [];

const isQuantityEquityValid = (quantityRequired, quantityEnable)  => quantityRequired <= quantityEnable;

class EquityController {
  async getEquitiesByClientId (req, res, next) {
    try {
      const { codCliente } = req.params;

      const equitiesFromClient = clientsEquities.filter((equity) => equity.CodCliente === Number(codCliente));
      const equitiesFromClientNames = equitiesFromClient.map((equity) => equity.CodAtivo);

      const equitiesAvailable = equitiesData.filter((equity) => !equitiesFromClientNames.includes(equity.CodAtivo));

      res.status(200).send([...equitiesFromClient, ...equitiesAvailable]);
    } catch (error) {
      next(error);
    }
  }

  async getEquityById (req, res, next) {
    try {
      const { codAtivo } = req.params;

      const equity = equitiesData.find((equity) =>  equity.CodAtivo === codAtivo);

      if (!equity) {
        return res.status(404).send({ message: `O ativo ${codAtivo} não existe` });
      }

      res.status(200).send({
        CodAtivo: codAtivo,
        QtdeAtivo: equity.QtdeAtivo,
        Valor: equity.Valor
      });
    } catch (error) {
      next(error);
    }
  }

  async buyEquity (req, res, next) {
    try {
      const { codCliente, codAtivo, qtdeAtivo } = req.body;

      const equity = equitiesData.find((equity) => equity.CodAtivo === codAtivo);

      if (!equity) {
        return res.status(404).send({ message: `O ativo ${codAtivo} não existe` });
      }

      if (!isQuantityEquityValid(Number(qtdeAtivo), equity.QtdeAtivo)) {
        return res.status(400).send({ message: `A quantidade do ativo ${codAtivo} não está disponível` });
      }

      const clientEquity = clientsEquities.find((equity) => equity.CodCliente === Number(codCliente) && equity.CodAtivo === codAtivo);

      const newClientEquity = {
        CodCliente: codCliente,
        CodAtivo: codAtivo,
        QtdeAtivo: clientEquity ? clientEquity.QtdeAtivo + qtdeAtivo : qtdeAtivo,
        Valor: equity.Valor
      };

      if (clientEquity) {
        clientsEquities = clientsEquities
          .filter((equity) => !equity.CodCliente === Number(codCliente) && !equity.CodAtivo === codAtivo)
      }

      clientsEquities.push(newClientEquity);

      res.status(200).send(newClientEquity);
    } catch (error) {
      next(error);
    }
  }

  async sellEquity (req, res, next) {
    try {
      const { codCliente, codAtivo, qtdeAtivo } = req.body;

      const clientEquity = clientsEquities.find((equity) => equity.CodCliente === Number(codCliente) && equity.CodAtivo === codAtivo);

      if (!clientEquity) {
        return res.status(404).send({ message: `O ativo ${codAtivo} não existe para o cliente ${codCliente}` });
      }

      if (!isQuantityEquityValid(Number(qtdeAtivo), clientEquity.QtdeAtivo)) {
        return res.status(400).send({ message: `A quantidade do ativo ${codAtivo} não está disponível` });
      }

      const newClientEquity = {
        CodCliente: codCliente,
        CodAtivo: codAtivo,
        QtdeAtivo: clientEquity.QtdeAtivo - qtdeAtivo,
        Valor: clientEquity.Valor
      };

      clientsEquities = clientsEquities
        .filter((equity) => !equity.CodCliente === codCliente && !equity.CodAtivo === codAtivo);

      clientsEquities.push(newClientEquity);

      res.status(200).send(newClientEquity);
    } catch (error) {
      next(error);
    }
  }

  async getClientAccount (req, res, next) {
    try {
      const { codCliente } = req.params;

      const clientAccount = clientsAccounts.find((account) => account.CodCliente === Number(codCliente));

      if (!clientAccount) {
        return res.status(404).send({ message: `O cliente ${codCliente} não tem uma conta` });
      }

      res.status(200).send(clientAccount);
    } catch (error) {
      next(error);
    }
  }

  async makeDeposit (req, res, next) {
    try {
      const { codCliente, Valor } = req.body;

      if (Number(Valor) <= 0) {
        return res.status(400).send({ message: `O valor a ser depósito deve ser maior que R$ 0` });
      }

      const clientAccount = clientsAccounts.find((account) => account.CodCliente === Number(codCliente));

      const newClientAccount= {
        CodCliente: codCliente,
        Saldo: clientAccount ? clientAccount.Saldo + Valor : Valor
      };

      if (clientAccount) {
        clientsAccounts = clientsAccounts
          .filter((account) => !account.CodCliente === Number(codCliente));
      }

      clientsAccounts.push(newClientAccount);

      res.status(200).send(newClientAccount);
    } catch (error) {
      next(error);
    }
  }

  async makeWithdrawal (req, res, next) {
    try {
      const { codCliente, Valor } = req.body;

      const clientAccount = clientsAccounts.find((account) => account.CodCliente === Number(codCliente));

      if (!clientAccount) {
        return res.status(404).send({ message: `O cliente ${codCliente} não tem uma conta` });
      }

      if (Number(Valor) <= 0 && Valor <= clientAccount.Saldo) {
        return res.status(400).send({ message: `O valor a ser sacado não está disponível` });
      }

      const newClientAccount= {
        CodCliente: codCliente,
        Saldo: clientAccount.Saldo - Valor
      };

      clientsAccounts = clientsAccounts
        .filter((account) => !account.CodCliente === Number(codCliente));

        clientsAccounts.push(newClientAccount);

      res.status(200).send(newClientAccount);
    } catch (error) {
      next(error);
    }
  }
}

export default new EquityController;
