"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  notification,
} from "antd";
import { format } from "date-fns";
import styled from "styled-components";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { BodyInterface, Employee, Event, Place } from "../libs/types";

const { Option } = Select;
const { RangePicker } = DatePicker;

const StyledPage = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CreatePage = () => {
  const [companies, setCompanies] = useState<any>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [event, setEvent] = useState<Event>({
    name: "",
    description: "",
    maxAttendant: 0,
    startDate: null,
    endDate: null,
  });
  const [tickets, setTickets] = useState<any[]>([]);
  const [expenditures, setExpenditures] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const user: any = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);

    if (parsedUser?.role !== "Administrator") router.push("/");

    axios
      .get("/api/create/company")
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: "Failed to fetch companies.",
        });
      });

    axios
      .get("/api/create/employee")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: "Failed to fetch employees.",
        });
      });

    axios
      .get("/api/create/place")
      .then((response) => {
        setPlaces(response.data);
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: "Failed to fetch places.",
        });
      });
  }, []);

  const handleCompanyChange = (value: React.SetStateAction<null>) => {
    setSelectedCompany(value);
  };

  const handleEventChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleDateChange = (dates, dateStrings) => {
    if (dates) {
      setEvent({ ...event, startDate: dates[0], endDate: dates[1] });
    } else {
      setEvent({ ...event, startDate: null, endDate: null });
    }
  };

  const addTicket = () => {
    setTickets([
      ...tickets,
      { ticketType: "", description: "", price: 0, name: "" },
    ]);
  };

  const handleTicketChange = (index: number, field: string, value: string) => {
    const newTickets = [...tickets];
    newTickets[index][field] = value;
    setTickets(newTickets);
  };

  const addExpenditure = () => {
    setExpenditures([
      ...expenditures,
      { name: "", description: "", cost: 0, purchaseDate: null },
    ]);
  };

  const handleExpenditureChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const newExpenditures = [...expenditures];
    newExpenditures[index][field] = value;
    setExpenditures(newExpenditures);
  };

  const handleExpenditureDateChange = (
    date: any,
    dateString: any,
    index: number
  ) => {
    const newExpenditures = [...expenditures];
    newExpenditures[index].purchaseDate = date;
    setExpenditures(newExpenditures);
  };

  const handleSubmit = async () => {
    if (!event.startDate || !event.endDate)
      return toast.error("Date(s) are empty");
    console.log(event);

    const formattedEvent: any = {
      ...event,
      startDate: format(event.startDate!.toDate(), "yyyy-MM-dd HH:mm:ss"),
      endDate: format(event.endDate!.toDate(), "yyyy-MM-dd HH:mm:ss"),
    };

    const formattedExpenditures: any = expenditures.map((expenditure: any) => ({
      ...expenditure,
      purchaseDate: format(
        expenditure.purchaseDate.toDate(),
        "yyyy-MM-dd HH:mm:ss"
      ),
    }));

    const data = {
      companyId: selectedCompany,
      event: formattedEvent,
      tickets,
      employees: selectedEmployees,
      places: selectedPlaces,
      expenditures: formattedExpenditures,
    } satisfies BodyInterface;

    if (
      !selectedCompany ||
      !event ||
      !tickets ||
      tickets.length == 0 ||
      employees.length == 0 ||
      places.length == 0 ||
      expenditures.length == 0
    )
      return toast.error("Input(s) is/are invalid");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/createevent",
        data
      );

      console.log(response);

      toast.success("Event created successfully!", {
        autoClose: 1000,
        onClose: () => {
          router.push("/");
        },
      });
    } catch (error: unknown) {
      toast.error("Error");
    }
  };

  return (
    <StyledPage>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1>Create Event</h1>
        <Form layout="vertical">
          <Form.Item label="Select Company">
            <Select onChange={handleCompanyChange}>
              {companies.map((company: any) => (
                <Option key={company.id} value={company.id}>
                  {company.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Select Employees">
            <Select
              mode="multiple"
              labelInValue
              onChange={(values: any) =>
                setSelectedEmployees(
                  values.map((val: any) => {
                    return employees.find((emp: Employee) => emp.id == val.key);
                  })
                )
              }
              value={selectedEmployees.map((emp) => {
                return {
                  key: emp.id,
                  label:
                    emp.id +
                    " | " +
                    emp.name +
                    " | " +
                    emp.age +
                    " | " +
                    emp.dailySalary,
                };
              })}
            >
              {employees.map((employee) => (
                <Option key={employee.id} value={employee.id}>
                  {employee.id} | {employee.name} | {employee.age} |{" "}
                  {employee.dailySalary}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Select Places">
            <Select
              mode="multiple"
              labelInValue
              value={selectedPlaces.map((plc) => ({
                key: plc.id,
                label: plc.id + " | " + plc.name + " | " + plc.description,
              }))}
              onChange={(values: any) =>
                setSelectedPlaces(
                  values.map((val: any) =>
                    places.find((plc: any) => plc.id == val.key)
                  )
                )
              }
            >
              {places.map((place) => (
                <Option key={place.id} value={place.id}>
                  {place.id} | {place.name} | {place.description}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Event Name">
            <Input
              name="name"
              value={event.name}
              onChange={handleEventChange}
            />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea
              name="description"
              value={event.description}
              onChange={handleEventChange}
            />
          </Form.Item>
          <Form.Item label="Max Attendant">
            <Input
              type="number"
              name="maxAttendant"
              value={event.maxAttendant}
              onChange={handleEventChange}
            />
          </Form.Item>
          <Form.Item label="Event Dates">
            <RangePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={handleDateChange}
            />
          </Form.Item>
          <h2>Tickets</h2>
          <Table
            dataSource={tickets}
            columns={[
              {
                title: "Type",
                dataIndex: "ticketType",
                render: (text, record, index) => (
                  <Select
                    value={text}
                    onChange={(value) =>
                      handleTicketChange(index, "ticketType", value)
                    }
                  >
                    {[
                      "normal_ticket",
                      "vip_ticket",
                      "student_ticket",
                      "group_ticket",
                      "early_bird_ticket",
                      "free_ticket",
                      "ultimate_vip_ticket",
                      "family_ticket",
                      "standard_plus_ticket",
                      "booth_rental_ticket",
                    ].map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                ),
              },
              {
                title: "Description",
                dataIndex: "description",
                render: (text, record, index) => (
                  <Input
                    value={text}
                    onChange={(e) =>
                      handleTicketChange(index, "description", e.target.value)
                    }
                  />
                ),
              },
              {
                title: "Price",
                dataIndex: "price",
                render: (text, record, index) => (
                  <Input
                    type="number"
                    value={text}
                    onChange={(e) =>
                      handleTicketChange(index, "price", e.target.value)
                    }
                  />
                ),
              },
              {
                title: "Name",
                dataIndex: "name",
                render: (text, record, index) => (
                  <Input
                    value={text}
                    onChange={(e) =>
                      handleTicketChange(index, "name", e.target.value)
                    }
                  />
                ),
              },
            ]}
            rowKey={(record: any, index: any) => index}
            pagination={false}
          />
          <Button onClick={addTicket}>Add Ticket</Button>
          <h2>Expenditures</h2>
          <Table
            dataSource={expenditures}
            columns={[
              {
                title: "Name",
                dataIndex: "name",
                render: (text, record, index) => (
                  <Input
                    value={text}
                    onChange={(e) =>
                      handleExpenditureChange(index, "name", e.target.value)
                    }
                  />
                ),
              },
              {
                title: "Description",
                dataIndex: "description",
                render: (text, record, index) => (
                  <Input
                    value={text}
                    onChange={(e) =>
                      handleExpenditureChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                  />
                ),
              },
              {
                title: "Cost",
                dataIndex: "cost",
                render: (text, record, index) => (
                  <Input
                    type="number"
                    value={text}
                    onChange={(e) =>
                      handleExpenditureChange(index, "cost", e.target.value)
                    }
                  />
                ),
              },
              {
                title: "Purchase Date",
                dataIndex: "purchaseDate",
                render: (text, record, index) => (
                  <DatePicker
                    showTime={{ format: "HH:mm" }}
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={(date, dateString) =>
                      handleExpenditureDateChange(date, dateString, index)
                    }
                  />
                ),
              },
            ]}
            rowKey={(record: any, index: any) => index}
            pagination={false}
          />
          <Button onClick={addExpenditure}>Add Expenditure</Button>
          <Form.Item>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </motion.div>
    </StyledPage>
  );
};

export default CreatePage;
